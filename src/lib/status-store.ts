import { defaultStatusSettings, type ClinicStatusSettings } from './clinic-status';
// Publishable project settings; database policies enforce administrator access.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://twgxohkkovkefzoyslov.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_xRiq-anmTCtvRBjPLVEx_Q_CqNAxqv7';
export const statusStoreConfigured = Boolean(url && key);
async function request(path: string, init: RequestInit = {}, token?: string) {
  if (!url || !key) throw new Error('관리 기능 연결 설정이 필요합니다.');
  const response = await fetch(`${url}${path}`, { ...init, cache: 'no-store', headers: { apikey: key, ...(token ? { Authorization: `Bearer ${token}` } : {}), 'Content-Type': 'application/json', ...init.headers }, signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(response.status === 401 || response.status === 403 ? '로그인 정보 또는 관리자 권한을 확인해 주세요.' : '연결에 실패했습니다. 잠시 후 다시 시도해 주세요.');
  return response.status === 204 ? null : response.json();
}
export async function readStatus(): Promise<ClinicStatusSettings> {
  const data = await request('/rest/v1/clinic_status?id=eq.1&select=mode,expires_at,message,holiday_dates');
  if (!Array.isArray(data) || data.length !== 1) throw new Error('진료 상태를 불러오지 못했습니다.');
  return { ...defaultStatusSettings, ...data[0] };
}
export async function loginStatus(email: string, password: string): Promise<string> {
  const data = await request('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) });
  const membership = await request('/rest/v1/clinic_admins?select=user_id', {}, data.access_token);
  if (!Array.isArray(membership) || membership.length !== 1) {
    await logoutStatus(data.access_token);
    throw new Error('관리자 권한이 없는 계정입니다.');
  }
  return data.access_token;
}
export async function saveStatus(settings: ClinicStatusSettings, token: string) {
  await request('/rest/v1/clinic_status?id=eq.1', { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(settings) }, token).then(data => { if (!Array.isArray(data) || data.length !== 1) throw new Error('저장 권한이 없습니다. 관리자 계정을 확인해 주세요.'); });
}
export async function logoutStatus(token: string) { await request('/auth/v1/logout', { method: 'POST' }, token); }
