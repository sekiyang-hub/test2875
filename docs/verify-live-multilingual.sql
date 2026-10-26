begin;
select set_config('request.jwt.claim.sub',(select user_id::text from public.clinic_admins limit 1),true);
set local role anon;
select public.submit_localized_appointment('cccccccc-2875-4287-8287-cccccccccccc','배포 검증용 가상 이름','+999000000001',now()+interval '3 days',true,'',repeat('c',64),'zh');
select public.update_localized_appointment('cccccccc-2875-4287-8287-cccccccccccc','배포 검증용 수정 이름','+999000000001',now()+interval '4 days',true,repeat('c',64),'ru');
set local role authenticated;
do $$ declare r public.appointment_requests; begin
 select * into r from public.appointment_requests where id='cccccccc-2875-4287-8287-cccccccccccc';
 if r.request_language<>'ru' or r.patient_revision<>2 or not r.needs_review then raise exception 'Multilingual edit and inbox failed'; end if;
 perform public.process_appointment(r.id,'confirmed',r.updated_at,now()+interval '4 days',true);
end $$;
reset role;
rollback;
select 'PASS: localized submit/edit/language recording/staff confirmation; synthetic data rolled back' as verification;
