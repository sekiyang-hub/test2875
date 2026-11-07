-- 새 예약 신청·환자 수정 시 Edge Function(notify-new-appointment)을 호출해 직원 텔레그램으로 알립니다.
create extension if not exists pg_net with schema extensions;

alter table public.appointment_requests add column if not exists notified_revision integer not null default 0;
-- 기존 신청은 이미 알린 것으로 간주해 연결 직후 알림이 쏟아지지 않게 합니다.
update public.appointment_requests set notified_revision=patient_revision;

-- 아직 알리지 않은 신청을 한 번에 가져가며 표시합니다(동시 호출 시 중복 알림 방지).
create or replace function public.claim_appointment_notifications()
returns table(id uuid, preferred_at timestamptz, request_language text, edited boolean)
language sql security definer set search_path=public,pg_temp as $$
 update public.appointment_requests r set notified_revision=r.patient_revision
 where r.needs_review and r.notified_revision<r.patient_revision and r.status in ('pending','contact_failed')
 returning r.id, r.preferred_at, r.request_language, r.patient_revision>1;
$$;
create or replace function public.release_appointment_notifications(p_ids uuid[])
returns void language sql security definer set search_path=public,pg_temp as $$
 update public.appointment_requests set notified_revision=0 where id=any(p_ids);
$$;
revoke all on function public.claim_appointment_notifications() from public,anon,authenticated;
revoke all on function public.release_appointment_notifications(uuid[]) from public,anon,authenticated;
grant execute on function public.claim_appointment_notifications() to service_role;
grant execute on function public.release_appointment_notifications(uuid[]) to service_role;

create or replace function public.notify_appointment_request() returns trigger
language plpgsql security definer set search_path=public,extensions,pg_temp as $$
begin
 perform net.http_post(
  url:='https://twgxohkkovkefzoyslov.supabase.co/functions/v1/notify-new-appointment',
  body:='{}'::jsonb,
  headers:='{"Content-Type":"application/json"}'::jsonb,
  timeout_milliseconds:=30000);
 return null;
exception when others then
 -- 알림 실패가 환자 신청 저장을 막으면 안 됩니다.
 return null;
end $$;
revoke all on function public.notify_appointment_request() from public,anon,authenticated;

drop trigger if exists notify_appointment_insert on public.appointment_requests;
drop trigger if exists notify_appointment_patient_edit on public.appointment_requests;
create trigger notify_appointment_insert after insert on public.appointment_requests
 for each row execute function public.notify_appointment_request();
create trigger notify_appointment_patient_edit after update on public.appointment_requests
 for each row when (new.patient_revision>old.patient_revision) execute function public.notify_appointment_request();

-- 관리용 호출(연결 테스트·단체방 찾기)에 쓰는 내부 키. 실제 값은 vault에만 저장합니다.
-- select vault.create_secret('<무작위 키>','notify_admin_key','텔레그램 알림 테스트·단체방 찾기용 내부 키');
create or replace function public.notify_admin_key() returns text
language sql security definer set search_path=public,vault,pg_temp as $$
 select decrypted_secret from vault.decrypted_secrets where name='notify_admin_key' limit 1;
$$;
revoke all on function public.notify_admin_key() from public,anon,authenticated;
grant execute on function public.notify_admin_key() to service_role;
