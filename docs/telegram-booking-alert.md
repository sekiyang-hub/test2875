# 텔레그램 새 예약 알림

새 예약 신청이나 환자 수정이 저장되면 DB 트리거(pg_net)가 Edge Function `notify-new-appointment`를 호출하고, 직원 텔레그램 단체방에 알립니다.

- 알림 내용: 건수, 희망 시간, 신청 언어(한국어 외), 관리자 화면 링크. **환자 이름·전화번호는 보내지 않습니다.**
- 봇: @yeonsuhappyteeth_bot / 단체방: '행복치과 봇관련'
- Supabase Edge Function 시크릿: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (대시보드 > Edge Functions > Secrets)
- 중복 방지: `appointment_requests.notified_revision`, `claim_appointment_notifications()`
- 전송 실패 시 표시를 되돌려 다음 신청 때 함께 알립니다.

## 단체방을 바꿀 때
1. 새 단체방에 봇을 초대하고 `/start@yeonsuhappyteeth_bot` 전송
2. 단체방 번호 확인 (SQL 편집기):
   `select net.http_post(url:='https://twgxohkkovkefzoyslov.supabase.co/functions/v1/notify-new-appointment', body:='{"discover":true}'::jsonb, headers:=jsonb_build_object('Content-Type','application/json','x-notify-key',public.notify_admin_key()), timeout_milliseconds:=20000);`
   → `select content from net._http_response order by id desc limit 1;`
3. `TELEGRAM_CHAT_ID` 값을 바꾸고, `{"test":true}`로 같은 호출을 하면 연결 확인 메시지가 갑니다.

일반 그룹이 '슈퍼그룹'으로 바뀌면(관리자 기능 사용 등) 번호가 `-100…`으로 바뀌므로 위 2–3을 다시 합니다.
