'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { defaultStatusSettings, seoulDate, type ClinicMode, type ClinicStatusSettings } from '@/lib/clinic-status';
import { loginStatusSession, logoutStatus, readStatus, refreshStatusSession, rememberedLogin, saveStatus, StatusAuthError, statusStoreConfigured, type StaffSession } from '@/lib/status-store';
const modes: [ClinicMode,string][] = [['auto','자동'],['open','진료 중'],['closed','진료 종료'],['holiday','휴진']];
export function StatusAdmin() {
  const [email,setEmail] = useState(''); const [password,setPassword] = useState(''); const [token,setToken] = useState('');
  const [settings,setSettings] = useState(defaultStatusSettings); const [end,setEnd] = useState(''); const [dates,setDates] = useState(''); const [notice,setNotice] = useState(''); const [busy,setBusy] = useState(false);
  const [keep,setKeep] = useState(true); const [restoring,setRestoring] = useState(false);
  const session = useRef<StaffSession|null>(null), remember = useRef(false);
  function show(data: ClinicStatusSettings) { setSettings(data); setDates(data.holiday_dates.join('\n')); setEnd(data.expires_at ? new Date(Date.parse(data.expires_at)+9*3600000).toISOString().slice(0,16) : `${seoulDate(new Date()).date}T23:59`); }
  function signedIn(next: StaffSession, keepLogin: boolean) { session.current = next; remember.current = keepLogin; if (keepLogin) rememberedLogin.write(next.refreshToken); else rememberedLogin.clear(); setToken(next.accessToken); }
  function signedOut(message: string) { session.current = null; remember.current = false; rememberedLogin.clear(); setToken(''); setNotice(message); }
  // 저장 직전에 만료가 가까우면 토큰을 새로 받아 1시간이 지나도 저장이 실패하지 않게 합니다.
  async function freshToken() {
    const current = session.current; if (!current) throw new StatusAuthError('다시 로그인해 주세요.');
    if (current.expiresAt > Date.now() + 60000) return current.accessToken;
    const next = await refreshStatusSession((remember.current && rememberedLogin.read()) || current.refreshToken);
    signedIn(next, remember.current); return next.accessToken;
  }
  useEffect(() => {
    if (!statusStoreConfigured) return;
    const stored = rememberedLogin.read(); if (!stored) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore of a remembered login on mount.
    setRestoring(true);
    refreshStatusSession(stored).then(async next => { signedIn(next, true); show(await readStatus()); })
      .catch(error => { if (error instanceof StatusAuthError) signedOut('로그인 유지가 만료됐습니다. 다시 로그인해 주세요.'); else setNotice('연결이 원활하지 않습니다. 새로고침하거나 다시 로그인해 주세요.'); })
      .finally(() => setRestoring(false));
  }, []);
  async function login(event: FormEvent) { event.preventDefault(); setBusy(true); setNotice(''); try { const next = await loginStatusSession(email,password); const data = await readStatus(); signedIn(next, keep); setPassword(''); show(data); } catch(error) { setNotice((error as Error).message); } finally { setBusy(false); } }
  async function save(event: FormEvent) { event.preventDefault(); setBusy(true); setNotice(''); try { const holiday_dates = dates.split(/[\s,]+/).filter(Boolean); if(holiday_dates.some(date => !/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(date).toISOString().slice(0,10) !== date)) throw new Error('공휴일 날짜는 YYYY-MM-DD 형식으로 입력해 주세요.'); const expires_at = settings.mode === 'auto' ? null : new Date(`${end}:00+09:00`).toISOString(); if(expires_at && Date.parse(expires_at) <= Date.now()) throw new Error('종료 시간을 현재보다 이후로 선택해 주세요.'); const next = { ...settings, expires_at, message: settings.mode === 'auto' ? '' : settings.message.trim(), holiday_dates: [...new Set(holiday_dates)] }; await saveStatus(next, await freshToken()); setSettings(await readStatus()); setNotice('저장했습니다. 홈페이지에 30초 이내 반영됩니다.'); } catch(error) { if (error instanceof StatusAuthError) signedOut('로그인이 만료됐습니다. 다시 로그인해 주세요.'); else setNotice((error as Error).message); } finally { setBusy(false); } }
  async function logout() { const current = session.current; signedOut('로그아웃했습니다.'); if (current) await logoutStatus(current.accessToken).catch(() => {}); }
  return <article className="container content status-admin"><h1>진료 상태 관리</h1><p>휴진이나 진료시간 변경을 홈페이지에 안내합니다.</p>{!statusStoreConfigured ? <div className="notice">관리 기능 연결을 준비 중입니다.</div> : restoring && !token ? <p role="status">로그인 상태를 확인하고 있습니다…</p> : !token ? <form onSubmit={login}><label>관리자 이메일<input type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>비밀번호<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><label className="status-keep"><input type="checkbox" checked={keep} onChange={e=>setKeep(e.target.checked)}/>이 PC에서 로그인 유지 <small>(여러 사람이 쓰는 PC라면 해제하세요)</small></label><button className="button" disabled={busy}>로그인</button></form> : <form onSubmit={save}><fieldset><legend>표시할 상태</legend><div className="status-options">{modes.map(([mode,label])=><label key={mode}><input type="radio" name="mode" checked={settings.mode === mode} onChange={()=>setSettings({...settings,mode})}/>{label}</label>)}</div></fieldset>{settings.mode !== 'auto' && <><label>언제까지 적용할까요? (한국 시간)<input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} required/></label><button className="button secondary" type="button" onClick={()=>setEnd(`${seoulDate(new Date()).date}T23:59`)}>오늘까지</button><label>방문자 안내 문구 (선택)<input maxLength={120} value={settings.message} onChange={e=>setSettings({...settings,message:e.target.value})} placeholder="예: 오늘은 병원 사정으로 휴진합니다."/></label><p>선택한 시간이 지나면 진료시간에 따른 자동 표시로 돌아갑니다.</p></>}<details><summary>설·추석·대체공휴일 및 특별 공휴일 등록</summary><p>등록한 날짜에는 10:00–17:00 진료시간을 적용합니다. 고정 공휴일과 주말은 자동 반영됩니다. 휴진은 위에서 별도로 선택하세요.</p><label>날짜 (한 줄에 하나)<textarea rows={6} value={dates} onChange={e=>setDates(e.target.value)} placeholder="2027-02-06"/></label></details><button className="button" disabled={busy}>{busy?'저장 중…':'홈페이지에 반영'}</button><button type="button" className="button secondary" onClick={()=>void logout()}>로그아웃</button></form>}<p role="status">{notice}</p></article>;
}
