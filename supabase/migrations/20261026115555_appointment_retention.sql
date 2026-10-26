begin;
create extension if not exists pg_cron;
select cron.schedule('simple-appointments-retention','0 18 * * *','select public.purge_old_appointments();');
commit;
