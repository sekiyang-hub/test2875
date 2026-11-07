-- 홈페이지 예약 신청은 환자 편의를 위한 접수 창구이고, 실제 예약은 전자차트(덴트웹)에서 관리합니다.
-- 직원이 통화·문자로 연락을 마치면 시간 입력 없이 한 번에 '처리 완료(done)'로 정리하고,
-- 실수로 처리한 신청은 다시 '접수(pending)'로 되돌릴 수 있게 합니다.
begin;
alter table public.appointment_requests drop constraint appointment_requests_status_check;
alter table public.appointment_requests add constraint appointment_requests_status_check
 check (status in ('pending','confirmed','done','rejected','cancelled','contact_failed'));

create or replace function public.process_appointment(p_id uuid,p_status text,p_expected_updated_at timestamptz,p_confirmed_at timestamptz default null,p_contacted boolean default false)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
declare r public.appointment_requests;
begin
 if not exists(select 1 from public.clinic_admins where user_id=auth.uid()) then raise exception '직원 권한이 필요합니다.'; end if;
 if p_status is null or p_status not in ('pending','confirmed','done','rejected','cancelled','contact_failed') then raise exception '처리 상태를 확인해 주세요.'; end if;
 select * into r from public.appointment_requests where id=p_id for update;
 if r.id is null then raise exception '접수 내역이 없습니다.'; end if;
 if r.updated_at is distinct from p_expected_updated_at then raise exception '다른 직원이 변경했습니다. 새로고침 후 확인해 주세요.'; end if;
 if p_status='pending' and r.status not in ('done','rejected','cancelled') then raise exception '되돌릴 수 있는 신청이 아닙니다.'; end if;
 if r.status in ('done','rejected','cancelled') and p_status<>'pending' then raise exception '이미 처리된 신청입니다. 먼저 되돌려 주세요.'; end if;
 if p_status='confirmed' and (p_contacted is distinct from true or p_confirmed_at is null or p_confirmed_at<=now()) then raise exception '환자와 통화 후 확정 시간을 입력하고 연락 확인에 체크해 주세요.'; end if;
 update public.appointment_requests set status=p_status,confirmed_at=case when p_status='confirmed' then p_confirmed_at else confirmed_at end,updated_at=clock_timestamp() where id=p_id;
 insert into public.appointment_events(request_id,actor_id,action) values(p_id,auth.uid(),p_status);
end $$;
revoke all on function public.process_appointment(uuid,text,timestamptz,timestamptz,boolean) from public,anon,authenticated;
grant execute on function public.process_appointment(uuid,text,timestamptz,timestamptz,boolean) to authenticated;
commit;
