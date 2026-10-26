begin;
select set_config('request.jwt.claim.sub',(select user_id::text from public.clinic_admins limit 1),true);
set local role anon;
select public.submit_appointment('bbbbbbbb-2875-4287-8287-bbbbbbbbbbbb','알림 검증 가상 신청','+821000000000',date_trunc('second',now())+interval '3 days',true,'',repeat('b',64));
reset role;
do $$ begin
 if has_function_privilege('anon','public.acknowledge_appointment(uuid,integer)','execute') then raise exception 'Anonymous acknowledgement allowed'; end if;
end $$;
set local role authenticated;
select public.acknowledge_appointment('bbbbbbbb-2875-4287-8287-bbbbbbbbbbbb',1);
do $$ begin
 if not exists(select 1 from public.appointment_requests where id='bbbbbbbb-2875-4287-8287-bbbbbbbbbbbb' and not needs_review) then raise exception 'Acknowledgement failed'; end if;
end $$;
set local role anon;
select public.update_appointment('bbbbbbbb-2875-4287-8287-bbbbbbbbbbbb','알림 검증 환자 수정','+821000000000',date_trunc('second',now())+interval '4 days',true,repeat('b',64));
set local role authenticated;
select public.acknowledge_appointment('bbbbbbbb-2875-4287-8287-bbbbbbbbbbbb',1);
do $$ declare r public.appointment_requests; begin
 select * into r from public.appointment_requests where id='bbbbbbbb-2875-4287-8287-bbbbbbbbbbbb';
 if r.patient_revision<>2 or not r.needs_review then raise exception 'Stale acknowledgement hid edit'; end if;
 perform public.process_appointment(r.id,'confirmed',r.updated_at,now()+interval '4 days',true);
 if not exists(select 1 from public.appointment_requests where id=r.id and not needs_review) then raise exception 'Staff confirmation acknowledgement failed'; end if;
end $$;
reset role;
rollback;
select 'PASS: live unread/acknowledgement/edit/concurrency/confirmation checks; all synthetic data rolled back' as verification;
