begin;
select set_config('request.jwt.claim.sub',(select user_id::text from public.clinic_admins limit 1),true);
set local role anon;
select public.submit_appointment('aaaaaaaa-2875-4287-8287-aaaaaaaaaaaa','배포 검증용 가상 신청','+821000000000',date_trunc('second',now())+interval '3 days',true,'',repeat('a',64));
do $$ begin
 begin perform * from public.appointment_requests; raise exception 'Anonymous read unexpectedly allowed'; exception when insufficient_privilege then null; end;
 begin perform public.update_appointment('aaaaaaaa-2875-4287-8287-aaaaaaaaaaaa','검증','+821000000000',now()+interval '3 days',true,repeat('b',64)); raise exception 'Wrong token accepted'; exception when raise_exception then if sqlerrm='Wrong token accepted' then raise; end if; end;
end $$;
select public.update_appointment('aaaaaaaa-2875-4287-8287-aaaaaaaaaaaa','배포 검증용 수정','+821000000000',date_trunc('second',now())+interval '4 days',true,repeat('a',64));
set local role authenticated;
do $$ declare r public.appointment_requests; begin
 select * into r from public.appointment_requests where id='aaaaaaaa-2875-4287-8287-aaaaaaaaaaaa';
 if r.patient_name is distinct from '배포 검증용 수정' then raise exception 'Staff read failed'; end if;
 perform public.process_appointment(r.id,'confirmed',r.updated_at,now()+interval '4 days',true);
 if not exists(select 1 from public.appointment_requests where id=r.id and status='confirmed') then raise exception 'Confirmation failed'; end if;
end $$;
set local role anon;
do $$ begin
 begin perform public.update_appointment('aaaaaaaa-2875-4287-8287-aaaaaaaaaaaa','검증','+821000000000',now()+interval '3 days',true,repeat('a',64)); raise exception 'Confirmed edit accepted'; exception when raise_exception then if sqlerrm='Confirmed edit accepted' then raise; end if; end;
end $$;
reset role;
rollback;
select 'PASS: live submit, patient edit, staff RLS read and confirmation, confirmed edit denied; all test data rolled back' as verification;
