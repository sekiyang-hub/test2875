begin;
create table public.appointment_requests (
 id uuid primary key,edit_hash text,patient_name text not null check(length(patient_name) between 1 and 40),
 phone text not null check(phone ~ '^\+[1-9][0-9]{7,14}$'),preferred_at timestamptz not null,confirmed_at timestamptz,
 status text not null default 'pending' check(status in ('pending','confirmed','rejected','cancelled','contact_failed')),
 consent_version text not null default '2026-10-26-simple',created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 check(status<>'confirmed' or confirmed_at is not null)
);
create index appointment_phone_time on public.appointment_requests(phone,created_at);
create table public.appointment_events (
 id bigint generated always as identity primary key,request_id uuid not null references public.appointment_requests(id) on delete cascade,
 actor_id uuid references auth.users(id),action text not null,created_at timestamptz not null default now()
);
alter table public.appointment_requests enable row level security;
alter table public.appointment_events enable row level security;
revoke all on public.appointment_requests,public.appointment_events from anon,authenticated;
grant select on public.appointment_requests to authenticated;
create policy "staff reads appointment requests" on public.appointment_requests for select to authenticated using(exists(select 1 from public.clinic_admins where user_id=auth.uid()));
create function public.submit_appointment(p_id uuid,p_name text,p_phone text,p_preferred_at timestamptz,p_consent boolean,p_website text default '',p_edit_token text default null)
returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare existing public.appointment_requests; token_hash text;
begin
 if p_edit_token is not null and p_edit_token !~ '^[0-9a-f]{64}$' then raise exception '수정 정보를 확인해 주세요.'; end if;
 token_hash:=case when p_edit_token is null then null else encode(sha256(convert_to(p_edit_token,'UTF8')),'hex') end;
 if p_website is distinct from '' then raise exception '접수를 완료하지 못했습니다. 병원에 전화해 주세요.'; end if;
 if p_id is null or p_name is null or length(trim(p_name)) not between 1 and 40 or p_phone is null or p_phone !~ '^\+[1-9][0-9]{7,14}$' or p_consent is distinct from true then raise exception '입력 내용과 개인정보 동의를 확인해 주세요.'; end if;
 if p_preferred_at is null or p_preferred_at<now()+interval '2 hours' or p_preferred_at>now()+interval '60 days' then raise exception '희망 시간은 2시간 후부터 60일 이내로 선택해 주세요.'; end if;
 perform pg_advisory_xact_lock(287527);
 select * into existing from public.appointment_requests where id=p_id;
 if existing.id is not null then
  if existing.edit_hash is distinct from token_hash then raise exception '접수 정보를 확인해 주세요.'; end if;
  if existing.patient_name=trim(p_name) and existing.phone=p_phone and existing.preferred_at=p_preferred_at then return existing.id; end if;
  raise exception '새로고침 후 다시 접수해 주세요.';
 end if;
 if (select count(*) from public.appointment_requests where phone=p_phone and created_at>now()-interval '1 day')>=3
 or (select count(*) from public.appointment_requests where created_at>now()-interval '1 hour')>=50
 or (select count(*) from public.appointment_requests where created_at>now()-interval '1 day')>=300 then
  raise exception '온라인 접수가 잠시 제한되었습니다. 병원에 전화해 주세요.';
 end if;
 insert into public.appointment_requests(id,patient_name,phone,preferred_at,edit_hash) values(p_id,trim(p_name),p_phone,p_preferred_at,token_hash);
 return p_id;
end $$;
revoke all on function public.submit_appointment(uuid,text,text,timestamptz,boolean,text,text) from public,anon,authenticated;
grant execute on function public.submit_appointment(uuid,text,text,timestamptz,boolean,text,text) to anon,authenticated;
-- The random capability stays in the submitting browser's memory; store only its hash.
create function public.update_appointment(p_id uuid,p_name text,p_phone text,p_preferred_at timestamptz,p_consent boolean,p_edit_token text)
returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare r public.appointment_requests;
begin
 if p_edit_token is null or p_edit_token !~ '^[0-9a-f]{64}$' then raise exception '수정 권한을 확인할 수 없습니다. 병원에 전화해 주세요.'; end if;
 select * into r from public.appointment_requests where id=p_id for update;
 if r.id is null or r.edit_hash is null or r.edit_hash is distinct from encode(sha256(convert_to(p_edit_token,'UTF8')),'hex') then raise exception '수정 권한을 확인할 수 없습니다. 병원에 전화해 주세요.'; end if;
 if r.confirmed_at is not null or r.status not in ('pending','contact_failed') then raise exception '직원이 이미 처리한 신청입니다. 변경은 병원에 전화해 주세요.'; end if;
 if p_name is null or length(trim(p_name)) not between 1 and 40 or p_phone is null or p_phone !~ '^\+[1-9][0-9]{7,14}$' or p_consent is distinct from true then raise exception '이름·연락처와 개인정보 동의를 확인해 주세요.'; end if;
 if p_preferred_at is null or p_preferred_at<now()+interval '2 hours' or p_preferred_at>now()+interval '60 days' then raise exception '희망 시간은 2시간 후부터 60일 이내로 선택해 주세요.'; end if;
 if (select count(*) from public.appointment_events where request_id=p_id and action='patient_edited' and created_at>now()-interval '1 day')>=10 then raise exception '수정 요청이 많습니다. 병원에 전화해 주세요.'; end if;
 update public.appointment_requests set patient_name=trim(p_name),phone=p_phone,preferred_at=p_preferred_at,status='pending',updated_at=clock_timestamp() where id=p_id;
 insert into public.appointment_events(request_id,actor_id,action) values(p_id,null,'patient_edited');
 return p_id;
end $$;
revoke all on function public.update_appointment(uuid,text,text,timestamptz,boolean,text) from public,anon,authenticated;
grant execute on function public.update_appointment(uuid,text,text,timestamptz,boolean,text) to anon,authenticated;
create function public.process_appointment(p_id uuid,p_status text,p_expected_updated_at timestamptz,p_confirmed_at timestamptz default null,p_contacted boolean default false)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
declare r public.appointment_requests;
begin
 if not exists(select 1 from public.clinic_admins where user_id=auth.uid()) then raise exception '직원 권한이 필요합니다.'; end if;
 if p_status is null or p_status not in ('confirmed','rejected','cancelled','contact_failed') then raise exception '처리 상태를 확인해 주세요.'; end if;
 select * into r from public.appointment_requests where id=p_id for update;
 if r.id is null then raise exception '접수 내역이 없습니다.'; end if;
 if r.updated_at is distinct from p_expected_updated_at then raise exception '다른 직원이 변경했습니다. 새로고침 후 확인해 주세요.'; end if;
 if r.status in ('cancelled','rejected') then raise exception '이미 종료된 신청입니다.'; end if;
 if p_status='confirmed' and (p_contacted is distinct from true or p_confirmed_at is null or p_confirmed_at<=now()) then raise exception '환자와 통화 후 확정 시간을 입력하고 연락 확인에 체크해 주세요.'; end if;
 update public.appointment_requests set status=p_status,confirmed_at=case when p_status='confirmed' then p_confirmed_at else confirmed_at end,updated_at=clock_timestamp() where id=p_id;
 insert into public.appointment_events(request_id,actor_id,action) values(p_id,auth.uid(),p_status);
end $$;
revoke all on function public.process_appointment(uuid,text,timestamptz,timestamptz,boolean) from public,anon,authenticated;
grant execute on function public.process_appointment(uuid,text,timestamptz,timestamptz,boolean) to authenticated;
create function public.purge_old_appointments() returns void language sql security definer set search_path=public,pg_temp as $$
 delete from public.appointment_requests where greatest(preferred_at,coalesce(confirmed_at,preferred_at),updated_at)<now()-interval '90 days'
$$;
revoke all on function public.purge_old_appointments() from public,anon,authenticated;
grant execute on function public.purge_old_appointments() to service_role;
commit;
