begin;
alter table public.appointment_requests add column request_language text not null default 'ko'
 check(request_language in ('ko','en','zh','vi','mn','ne','ru','uz','th'));
-- Keep the original endpoints intact for already-open Korean pages.
create function public.submit_localized_appointment(p_id uuid,p_name text,p_phone text,p_preferred_at timestamptz,p_consent boolean,p_website text,p_edit_token text,p_language text)
returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare result uuid;
begin
 if p_language is null or p_language not in ('ko','en','zh','vi','mn','ne','ru','uz','th') then raise exception '신청 언어를 확인해 주세요.'; end if;
 result:=public.submit_appointment(p_id,p_name,p_phone,p_preferred_at,p_consent,p_website,p_edit_token);
 update public.appointment_requests set request_language=p_language,consent_version='simple-2026-10-27-multilingual' where id=result;
 return result;
end $$;
revoke all on function public.submit_localized_appointment(uuid,text,text,timestamptz,boolean,text,text,text) from public,anon,authenticated;
grant execute on function public.submit_localized_appointment(uuid,text,text,timestamptz,boolean,text,text,text) to anon,authenticated;
create function public.update_localized_appointment(p_id uuid,p_name text,p_phone text,p_preferred_at timestamptz,p_consent boolean,p_edit_token text,p_language text)
returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare result uuid;
begin
 if p_language is null or p_language not in ('ko','en','zh','vi','mn','ne','ru','uz','th') then raise exception '신청 언어를 확인해 주세요.'; end if;
 result:=public.update_appointment(p_id,p_name,p_phone,p_preferred_at,p_consent,p_edit_token);
 update public.appointment_requests set request_language=p_language,consent_version='simple-2026-10-27-multilingual' where id=result;
 return result;
end $$;
revoke all on function public.update_localized_appointment(uuid,text,text,timestamptz,boolean,text,text) from public,anon,authenticated;
grant execute on function public.update_localized_appointment(uuid,text,text,timestamptz,boolean,text,text) to anon,authenticated;
commit;

