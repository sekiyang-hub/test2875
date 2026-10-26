begin;
alter table public.appointment_requests
 add column patient_revision integer not null default 1,
 add column staff_seen_revision integer not null default 0,
 add column patient_changed_at timestamptz not null default now(),
 add column needs_review boolean generated always as (staff_seen_revision < patient_revision) stored;
update public.appointment_requests set patient_changed_at=created_at,
 staff_seen_revision=case when status in ('pending','contact_failed') then 0 else 1 end;
alter table public.appointment_requests add constraint appointment_revision_bounds
 check (patient_revision>=1 and staff_seen_revision between 0 and patient_revision);
create function public.track_appointment_revision() returns trigger
 language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if (new.patient_name,new.phone,new.preferred_at) is distinct from (old.patient_name,old.phone,old.preferred_at) then
  new.patient_revision:=old.patient_revision+1;
  new.patient_changed_at:=clock_timestamp();
 end if;
 if (new.status,new.confirmed_at) is distinct from (old.status,old.confirmed_at)
 and exists(select 1 from public.clinic_admins where user_id=auth.uid()) then
  new.staff_seen_revision:=new.patient_revision;
 end if;
 return new;
end $$;
revoke all on function public.track_appointment_revision() from public,anon,authenticated;
create trigger track_appointment_revision before update on public.appointment_requests
 for each row execute function public.track_appointment_revision();
create function public.acknowledge_appointment(p_id uuid,p_revision integer) returns void
 language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if not exists(select 1 from public.clinic_admins where user_id=auth.uid()) then
  raise exception '직원 권한이 필요합니다.';
 end if;
 if p_revision is null or p_revision<1 then raise exception '확인할 신청을 다시 불러와 주세요.'; end if;
 update public.appointment_requests
 set staff_seen_revision=greatest(staff_seen_revision,least(p_revision,patient_revision))
 where id=p_id;
 if not found then raise exception '접수 내역이 없습니다.'; end if;
end $$;
revoke all on function public.acknowledge_appointment(uuid,integer) from public,anon,authenticated;
grant execute on function public.acknowledge_appointment(uuid,integer) to authenticated;
create index appointment_inbox_order on public.appointment_requests(needs_review desc,created_at desc);
commit;
