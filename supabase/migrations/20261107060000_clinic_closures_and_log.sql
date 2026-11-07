-- 진료 상태 관리 개선: 미래 휴진 예약(clinic_closures)과 변경 기록(clinic_status_events)
create table if not exists public.clinic_closures(
 id uuid primary key default gen_random_uuid(),
 starts_at timestamptz not null,
 ends_at timestamptz not null,
 message text not null default '' check (length(message)<=120),
 created_at timestamptz not null default now(),
 check (ends_at>starts_at),
 check (ends_at<=starts_at+interval '62 days')
);
alter table public.clinic_closures enable row level security;
create policy "public can read upcoming closures" on public.clinic_closures for select to anon,authenticated
 using (ends_at>now()-interval '1 day');
create policy "clinic admins can add closures" on public.clinic_closures for insert to authenticated
 with check (exists(select 1 from public.clinic_admins where user_id=(select auth.uid())));
create policy "clinic admins can delete closures" on public.clinic_closures for delete to authenticated
 using (exists(select 1 from public.clinic_admins where user_id=(select auth.uid())));
grant select on public.clinic_closures to anon,authenticated;
grant insert,delete on public.clinic_closures to authenticated;
create index if not exists clinic_closures_ends on public.clinic_closures(ends_at);

create table if not exists public.clinic_status_events(
 id bigint generated always as identity primary key,
 created_at timestamptz not null default now(),
 actor_email text not null default '',
 action text not null check (action in ('status','closure_add','closure_delete')),
 detail jsonb not null default '{}'::jsonb
);
alter table public.clinic_status_events enable row level security;
create policy "clinic admins can read status events" on public.clinic_status_events for select to authenticated
 using (exists(select 1 from public.clinic_admins where user_id=(select auth.uid())));
grant select on public.clinic_status_events to authenticated;
create index if not exists clinic_status_events_created on public.clinic_status_events(created_at desc);

create or replace function public.log_clinic_status_event() returns trigger
language plpgsql security definer set search_path=public,pg_temp as $$
declare actor text:=coalesce(auth.jwt()->>'email','');
begin
 if tg_table_name='clinic_status' then
  if (new.mode,new.expires_at,new.message,new.holiday_dates) is distinct from (old.mode,old.expires_at,old.message,old.holiday_dates) then
   insert into public.clinic_status_events(actor_email,action,detail) values(actor,'status',jsonb_build_object(
    'mode',new.mode,'expires_at',new.expires_at,'message',new.message,
    'holidays_changed',new.holiday_dates is distinct from old.holiday_dates));
  end if;
  return new;
 elsif tg_op='INSERT' then
  insert into public.clinic_status_events(actor_email,action,detail) values(actor,'closure_add',jsonb_build_object('starts_at',new.starts_at,'ends_at',new.ends_at,'message',new.message));
  return new;
 else
  insert into public.clinic_status_events(actor_email,action,detail) values(actor,'closure_delete',jsonb_build_object('starts_at',old.starts_at,'ends_at',old.ends_at,'message',old.message));
  return old;
 end if;
end $$;
revoke all on function public.log_clinic_status_event() from public,anon,authenticated;
drop trigger if exists log_clinic_status_event on public.clinic_status;
create trigger log_clinic_status_event after update on public.clinic_status for each row execute function public.log_clinic_status_event();
drop trigger if exists log_clinic_closure_add on public.clinic_closures;
drop trigger if exists log_clinic_closure_delete on public.clinic_closures;
create trigger log_clinic_closure_add after insert on public.clinic_closures for each row execute function public.log_clinic_status_event();
create trigger log_clinic_closure_delete after delete on public.clinic_closures for each row execute function public.log_clinic_status_event();

-- 매일 18:00(한국 시간) 내일 끝나는 휴진 표시·내일 시작하는 예약 휴진을 텔레그램으로 알립니다.
select cron.unschedule(jobid) from cron.job where jobname='clinic-status-reminder';
select cron.schedule('clinic-status-reminder','0 9 * * *',$cron$
 select net.http_post(
  url:='https://twgxohkkovkefzoyslov.supabase.co/functions/v1/notify-new-appointment',
  body:='{"reminder":true}'::jsonb,
  headers:=jsonb_build_object('Content-Type','application/json','x-notify-key',public.notify_admin_key()),
  timeout_milliseconds:=30000);
 delete from public.clinic_status_events where created_at<now()-interval '1 year';
$cron$);
