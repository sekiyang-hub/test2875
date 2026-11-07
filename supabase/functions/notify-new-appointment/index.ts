// 새 예약 신청·환자 수정이 들어오면 직원 텔레그램 단체방에 알립니다.
// - DB 트리거(pg_net)가 이 함수를 호출합니다. 호출 내용은 믿지 않고, DB에서 아직 알리지 않은 신청만 원자적으로 가져옵니다.
//   그래서 누가 이 주소를 호출해도 새 신청이 없으면 아무것도 보내지 않습니다.
// - 개인정보 최소화: 환자 이름·전화번호는 보내지 않고 희망 시간과 관리자 화면 링크만 보냅니다.
// 필요한 시크릿: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
// 관리용 호출(test: 연결 확인 메시지, discover: 봇이 들어간 단체방 번호 찾기)은 DB vault의 notify_admin_key가 있어야 합니다.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ADMIN_URL = "https://www.dental365.net/admin/bookings/";
const languages: Record<string, string> = { en: "영어", zh: "중국어", vi: "베트남어", mn: "몽골어", ne: "네팔어", ru: "러시아어", uz: "우즈베크어", th: "태국어" };
type Claimed = { id: string; preferred_at: string; request_language: string | null; edited: boolean };

const slot = (iso: string) =>
  new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", month: "long", day: "numeric", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

async function sendTelegram(token: string, chatId: string, text: string) {
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`telegram ${response.status}: ${(await response.text()).slice(0, 200)}`);
}

function compose(rows: Claimed[]) {
  const fresh = rows.filter((r) => !r.edited), edited = rows.filter((r) => r.edited);
  const line = (r: Claimed) => `• 희망 ${slot(r.preferred_at)}${r.request_language && r.request_language !== "ko" ? ` (${languages[r.request_language] ?? r.request_language})` : ""}`;
  const parts: string[] = [];
  if (fresh.length) parts.push(`🦷 새 예약 신청 ${fresh.length}건`, ...fresh.map(line));
  if (edited.length) parts.push(`${parts.length ? "\n" : ""}✏️ 환자가 신청을 수정했어요 ${edited.length}건`, ...edited.map(line));
  parts.push("", `확인하기: ${ADMIN_URL}`);
  return parts.join("\n");
}

const rest = (path: string, body: unknown) => {
  const url = Deno.env.get("SUPABASE_URL")!, service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return fetch(`${url}/rest/v1/rpc/${path}`, {
    method: "POST",
    headers: { apikey: service, Authorization: `Bearer ${service}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });
};

const restGet = (path: string) => {
  const url = Deno.env.get("SUPABASE_URL")!, service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return fetch(`${url}/rest/v1/${path}`, { headers: { apikey: service, Authorization: `Bearer ${service}` }, signal: AbortSignal.timeout(10000) }).then((r) => r.json());
};
const STATUS_URL = "https://www.dental365.net/admin/";
const modeNames: Record<string, string> = { open: "진료 중", closed: "진료 종료", holiday: "휴진" };
const day = (iso: string) => new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", month: "long", day: "numeric", weekday: "short" }).format(new Date(iso));

// 매일 18시(pg_cron) 호출: 30시간 안에 끝나는 직접 설정 상태, 시작·종료되는 예약 휴진을 알려 줍니다.
async function statusReminders() {
  const now = Date.now(), soon = now + 30 * 3600000;
  const [status] = await restGet("clinic_status?id=eq.1&select=mode,expires_at,message");
  const closures = await restGet(`clinic_closures?select=starts_at,ends_at,message&ends_at=gt.${encodeURIComponent(new Date(now).toISOString())}&order=starts_at.asc`);
  const lines: string[] = [];
  if (status && status.mode !== "auto" && status.expires_at) {
    const t = Date.parse(status.expires_at);
    if (t > now && t <= soon) lines.push(`⏰ ‘${modeNames[status.mode] ?? status.mode}’ 표시가 ${slot(status.expires_at)}에 끝나고 진료시간 자동 표시로 돌아갑니다.\n연장이 필요하면 관리 화면에서 기간을 바꿔 주세요.`);
  }
  for (const c of closures ?? []) {
    const start = Date.parse(c.starts_at), end = Date.parse(c.ends_at);
    if (start > now && start <= soon) lines.push(`📅 ${day(c.starts_at)}부터 예약된 휴진이 시작됩니다.${c.message ? `\n안내 문구: ${c.message}` : ""}`);
    else if (start <= now && end > now && end <= soon) lines.push(`📅 예약된 휴진이 ${day(new Date(end - 1).toISOString())}까지이고, 이후 정상 진료 표시로 돌아갑니다.`);
  }
  return lines.length ? `${lines.join("\n\n")}\n\n관리 화면: ${STATUS_URL}` : null;
}

async function isAdmin(req: Request) {
  const given = req.headers.get("x-notify-key");
  if (!given) return false;
  const response = await rest("notify_admin_key", {});
  return response.ok && given === (await response.json());
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "method" }, 405);
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN"), chatId = Deno.env.get("TELEGRAM_CHAT_ID");
  const body = await req.json().catch(() => ({}));

  if (body?.reminder === true) {
    if (!(await isAdmin(req))) return json({ error: "forbidden" }, 403);
    if (!token || !chatId) return json({ skipped: "telegram not configured" });
    const text = await statusReminders();
    if (!text) return json({ sent: 0 });
    if (body.dryRun === true) return json({ dryRun: text });
    await sendTelegram(token, chatId, text);
    return json({ sent: "reminder" });
  }

  if (body?.discover === true || body?.test === true) {
    if (!(await isAdmin(req))) return json({ error: "forbidden" }, 403);
    if (!token) return json({ error: "TELEGRAM_BOT_TOKEN not set" }, 400);
    if (body.discover) {
      const updates = await fetch(`https://api.telegram.org/bot${token}/getUpdates`).then((r) => r.json());
      const chats = new Map<number, { id: number; type: string; title: string }>();
      for (const u of updates.result ?? []) {
        const c = (u.message ?? u.my_chat_member ?? u.channel_post)?.chat;
        if (c) chats.set(c.id, { id: c.id, type: c.type, title: c.title ?? c.first_name ?? "" });
      }
      const me = await fetch(`https://api.telegram.org/bot${token}/getMe`).then((r) => r.json());
      return json({ bot: me.result?.username, chats: [...chats.values()] });
    }
    if (!chatId) return json({ error: "TELEGRAM_CHAT_ID not set" }, 400);
    await sendTelegram(token, chatId, `✅ 연수행복치과 예약 알림이 연결되었습니다.\n새 신청이 들어오면 이 방으로 알려드립니다.\n\n${ADMIN_URL}`);
    return json({ sent: "test" });
  }

  if (!token || !chatId) return json({ skipped: "telegram not configured" });
  const claim = await rest("claim_appointment_notifications", {});
  if (!claim.ok) return json({ error: `claim ${claim.status}` }, 500);
  const rows = (await claim.json()) as Claimed[];
  if (!rows.length) return json({ sent: 0 });

  try {
    await sendTelegram(token, chatId, compose(rows));
  } catch (error) {
    // 전송 실패 시 다음 신청 때 다시 알릴 수 있도록 표시를 되돌립니다.
    await rest("release_appointment_notifications", { p_ids: rows.map((r) => r.id) }).catch(() => {});
    console.error(String(error));
    return json({ error: "telegram failed" }, 502);
  }
  return json({ sent: rows.length });
});
