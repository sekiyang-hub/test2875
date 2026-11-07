'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { defaultStatusSettings, resolveClinicStatus, seoulDate, type ClinicClosure, type ClinicMode, type ClinicStatusSettings } from '@/lib/clinic-status';
import { addClosure, deleteClosure, loginStatusSession, logoutStatus, readClosures, readStatus, readStatusEvents, refreshStatusSession, rememberedLogin, saveStatus, StatusAuthError, statusStoreConfigured, type StaffSession, type StatusEvent } from '@/lib/status-store';
import { AdminTabs } from './admin-tabs';

const modes: {id:ClinicMode;label:string;desc:string}[] = [
 {id:'auto',label:'자동',desc:'진료시간에 맞춰 ‘진료 중/진료 종료’가 바뀌어요 (평일 10–21시, 주말·공휴일 10–17시)'},
 {id:'open',label:'진료 중',desc:'시간과 상관없이 ‘진료 중’ — 연장·임시 진료 때'},
 {id:'closed',label:'진료 종료',desc:'시간과 상관없이 ‘진료 종료’ — 오늘 일찍 마감할 때'},
 {id:'holiday',label:'휴진',desc:'‘휴진’ 표시 — 휴가·학회·이전 준비 때'},
];
const modeLabel: Record<string,string> = {auto:'자동',open:'진료 중',closed:'진료 종료',holiday:'휴진'};
const templates = ['병원 이전 준비로 휴진합니다.','원장 학회 참석으로 휴진합니다.','병원 사정으로 휴진합니다.','오늘은 오후 진료만 합니다.','오늘은 진료를 일찍 마감합니다.','진료시간이 연장됩니다.'];
const KST = 9*3600000, DAY = 86400000;
const toInput = (iso:string) => new Date(Date.parse(iso)+KST).toISOString().slice(0,16);
const fromInput = (value:string) => new Date(`${value}:00+09:00`).toISOString();
const addDays = (date:string, days:number) => new Date(Date.parse(`${date}T00:00:00Z`)+days*DAY).toISOString().slice(0,10);
const sameTime = (a:string|null, b:string|null) => (a===null||b===null) ? a===b : Date.parse(a)===Date.parse(b);
const fmt = (iso:string, opts:Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',...opts}).format(new Date(iso));
const whenLabel = (iso:string) => fmt(iso,{month:'long',day:'numeric',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const dayLabel = (iso:string) => fmt(iso,{month:'long',day:'numeric',weekday:'short'});
function rangeLabel(starts:string, ends:string) {
 const first = dayLabel(starts), last = dayLabel(new Date(Date.parse(ends)-1).toISOString());
 return first === last ? first : `${first} ~ ${last}`;
}
function presets(now:Date) {
 const today = seoulDate(now);
 const sunday = addDays(today.date, (7-today.day)%7);
 const list = [{label:'오늘까지',value:`${today.date}T23:59`},{label:'내일까지',value:`${addDays(today.date,1)}T23:59`},{label:'이번 주 일요일까지',value:`${sunday}T23:59`}];
 return list.filter((p,i) => list.findIndex(q => q.value===p.value)===i);
}

function Preview({now,settings,closures}:{now:Date;settings:ClinicStatusSettings;closures:ClinicClosure[]}) {
 const r = resolveClinicStatus(now, settings, closures);
 return <div className={`sa-preview status-${r.mode}`}>
  <strong><span className="status-dot" aria-hidden="true"/>{modeLabel[r.mode]}</strong>
  {r.mode==='open'&&!r.manual&&<span>오늘 {r.closes}까지 진료</span>}
  {r.message&&<span>{r.message}</span>}
  {!r.manual&&<small>진료시간에 따른 안내 · 방문 전 확인해 주세요</small>}
 </div>;
}

function eventText(e:StatusEvent) {
 const d = e.detail as {mode?:string;expires_at?:string|null;message?:string;holidays_changed?:boolean;starts_at?:string;ends_at?:string};
 if (e.action==='closure_add') return `휴진 예약 추가 · ${rangeLabel(d.starts_at!,d.ends_at!)}${d.message?` · “${d.message}”`:''}`;
 if (e.action==='closure_delete') return `휴진 예약 삭제 · ${rangeLabel(d.starts_at!,d.ends_at!)}`;
 const parts = [d.mode==='auto'?'자동 표시로 변경':`‘${modeLabel[d.mode||'']||d.mode}’로 변경${d.expires_at?` · ${whenLabel(d.expires_at)}까지`:''}`];
 if (d.mode!=='auto'&&d.message) parts.push(`“${d.message}”`);
 if (d.holidays_changed) parts.push('공휴일 목록 수정');
 return parts.join(' · ');
}

export function StatusAdmin() {
 const [email,setEmail] = useState(''); const [password,setPassword] = useState(''); const [token,setToken] = useState('');
 const [saved,setSaved] = useState(defaultStatusSettings); const [draft,setDraft] = useState(defaultStatusSettings);
 const [end,setEnd] = useState(''); const [custom,setCustom] = useState(false); const [dates,setDates] = useState('');
 const [closures,setClosures] = useState<ClinicClosure[]>([]); const [events,setEvents] = useState<StatusEvent[]>([]);
 const [closureStart,setClosureStart] = useState(''); const [closureEnd,setClosureEnd] = useState(''); const [closureMessage,setClosureMessage] = useState('');
 const [notice,setNotice] = useState(''); const [busy,setBusy] = useState(false); const [keep,setKeep] = useState(true); const [restoring,setRestoring] = useState(false);
 const [now,setNow] = useState(() => new Date());
 const session = useRef<StaffSession|null>(null), remember = useRef(false);

 useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);
 function signedIn(next:StaffSession, keepLogin:boolean) { session.current = next; remember.current = keepLogin; if (keepLogin) rememberedLogin.write(next.refreshToken); else rememberedLogin.clear(); setToken(next.accessToken); }
 function signedOut(message:string) { session.current = null; remember.current = false; rememberedLogin.clear(); setToken(''); setNotice(message); }
 async function freshToken() {
  const current = session.current; if (!current) throw new StatusAuthError('다시 로그인해 주세요.');
  // eslint-disable-next-line react-hooks/purity -- runs inside an event handler, not during render.
  if (current.expiresAt > Date.now()+60000) return current.accessToken;
  const next = await refreshStatusSession((remember.current && rememberedLogin.read()) || current.refreshToken);
  signedIn(next, remember.current); return next.accessToken;
 }
 function apply(data:ClinicStatusSettings) {
  const current = new Date(); setNow(current); setSaved(data);
  const active = data.mode!=='auto' && data.expires_at && Date.parse(data.expires_at) > current.getTime();
  setDraft(active ? data : {...data, mode:'auto', message:''});
  const today = seoulDate(current).date;
  setEnd(active && data.expires_at ? toInput(data.expires_at) : `${today}T23:59`);
  setCustom(Boolean(active && data.expires_at && !presets(current).some(p => p.value===toInput(data.expires_at!))));
  setDates(data.holiday_dates.join('\n'));
  if (!closureStart) { setClosureStart(addDays(today,1)); setClosureEnd(addDays(today,1)); }
 }
 async function load(accessToken:string) {
  const [data, upcoming, log] = await Promise.all([readStatus(), readClosures(), readStatusEvents(accessToken).catch(() => [] as StatusEvent[])]);
  apply(data); setClosures(upcoming); setEvents(log);
 }
 useEffect(() => {
  if (!statusStoreConfigured) return;
  const stored = rememberedLogin.read(); if (!stored) return;
  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore of a remembered login on mount.
  setRestoring(true);
  refreshStatusSession(stored).then(async next => { signedIn(next, true); await load(next.accessToken); })
   .catch(error => { if (error instanceof StatusAuthError) signedOut('로그인 유지가 만료됐습니다. 다시 로그인해 주세요.'); else setNotice('연결이 원활하지 않습니다. 새로고침하거나 다시 로그인해 주세요.'); })
   .finally(() => setRestoring(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount.
 }, []);
 async function run(fn:()=>Promise<void>) { setBusy(true); setNotice(''); try { await fn(); } catch(error) { if (error instanceof StatusAuthError) signedOut('로그인이 만료됐습니다. 다시 로그인해 주세요.'); else setNotice((error as Error).message); } finally { setBusy(false); } }
 async function login(event:FormEvent) { event.preventDefault(); await run(async () => { const next = await loginStatusSession(email,password); signedIn(next, keep); setPassword(''); await load(next.accessToken); }); }

 const draftExpires = draft.mode==='auto' ? null : (end ? fromInput(end) : null);
 const draftSettings = {...draft, expires_at: draftExpires, message: draft.mode==='auto' ? '' : draft.message};
 const savedActive = saved.mode!=='auto' && saved.expires_at && Date.parse(saved.expires_at) > now.getTime();
 const savedEffective = savedActive ? saved : {...saved, mode:'auto' as ClinicMode, message:'', expires_at:null};
 const dirty = draftSettings.mode!==savedEffective.mode || (draftSettings.mode!=='auto' && (!sameTime(draftSettings.expires_at,savedEffective.expires_at) || draftSettings.message.trim()!==savedEffective.message)) || dates.split(/[\s,]+/).filter(Boolean).join(',')!==saved.holiday_dates.join(',');

 async function save(event:FormEvent) {
  event.preventDefault();
  await run(async () => {
   const holiday_dates = dates.split(/[\s,]+/).filter(Boolean);
   if (holiday_dates.some(date => !/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(date).toISOString().slice(0,10)!==date)) throw new Error('공휴일 날짜는 YYYY-MM-DD 형식으로 입력해 주세요.');
   if (draftExpires && Date.parse(draftExpires) <= Date.now()) throw new Error('종료 시간을 현재보다 이후로 선택해 주세요.');
   const next = {...draft, expires_at: draftExpires, message: draft.mode==='auto' ? '' : draft.message.trim(), holiday_dates: [...new Set(holiday_dates)]};
   const access = await freshToken(); await saveStatus(next, access); await load(access);
   setNotice('저장했습니다. 홈페이지에 30초 이내 반영됩니다.');
  });
 }
 async function addScheduled(event:FormEvent) {
  event.preventDefault();
  await run(async () => {
   const today = seoulDate(new Date()).date;
   if (!closureStart || !closureEnd) throw new Error('휴진 날짜를 선택해 주세요.');
   if (closureStart < today) throw new Error('오늘 이후 날짜를 선택해 주세요.');
   if (closureEnd < closureStart) throw new Error('마지막 날이 시작일보다 빠릅니다.');
   const starts_at = new Date(`${closureStart}T00:00:00+09:00`).toISOString(), ends_at = new Date(`${addDays(closureEnd,1)}T00:00:00+09:00`).toISOString();
   if (Date.parse(ends_at)-Date.parse(starts_at) > 62*DAY) throw new Error('한 번에 62일까지 예약할 수 있습니다.');
   if (closures.some(c => Date.parse(c.starts_at) < Date.parse(ends_at) && Date.parse(c.ends_at) > Date.parse(starts_at))) throw new Error('이미 예약된 휴진 기간과 겹칩니다.');
   const access = await freshToken(); await addClosure({starts_at, ends_at, message: closureMessage.trim()}, access); await load(access);
   setClosureMessage(''); setNotice(`${rangeLabel(starts_at,ends_at)} 휴진을 예약했습니다. 그날 홈페이지에 자동으로 ‘휴진’이 표시됩니다.`);
  });
 }
 async function removeScheduled(c:ClinicClosure) {
  if (!window.confirm(`${rangeLabel(c.starts_at,c.ends_at)} 휴진 예약을 삭제할까요?`)) return;
  await run(async () => { const access = await freshToken(); await deleteClosure(c.id, access); await load(access); setNotice('휴진 예약을 삭제했습니다.'); });
 }
 async function logout() { const current = session.current; signedOut('로그아웃했습니다.'); if (current) await logoutStatus(current.accessToken).catch(() => {}); }

 const result = resolveClinicStatus(now, saved, closures);
 const nextClosure = closures.find(c => Date.parse(c.starts_at) > now.getTime());

 if (!statusStoreConfigured) return <article className="container content status-admin sa"><div className="notice">관리 기능 연결을 준비 중입니다.</div></article>;
 if (!token) return <article className="container content status-admin sa"><AdminTabs current="status"/><h1 className="sa-title">진료 상태 관리</h1>
  {restoring ? <p role="status">로그인 상태를 확인하고 있습니다…</p> : <form className="sa-card sa-login" onSubmit={login}>
   <label>관리자 이메일<input type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
   <label>비밀번호<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
   <label className="status-keep"><input type="checkbox" checked={keep} onChange={e=>setKeep(e.target.checked)}/>이 PC에서 로그인 유지 <small>(여러 사람이 쓰는 PC라면 해제하세요)</small></label>
   <button className="button" disabled={busy}>로그인</button>
  </form>}
  <p role="status">{notice}</p>
 </article>;

 return <article className="container content status-admin sa">
  <AdminTabs current="status"/>
  <section className="sa-card sa-now" aria-label="현재 홈페이지 상태">
   <h2>지금 홈페이지에는</h2>
   <Preview now={now} settings={saved} closures={closures}/>
   <p className="sa-source">{result.source==='manual'&&result.until?<>직접 설정 · <b>{whenLabel(result.until)}</b>까지, 이후 자동 표시로 돌아가요</>:result.source==='closure'&&result.until?<>예약된 휴진 · <b>{whenLabel(result.until)}</b> 전까지</>:'진료시간에 따른 자동 표시'}</p>
   {nextClosure&&<p className="sa-source">다음 예약 휴진: <b>{rangeLabel(nextClosure.starts_at,nextClosure.ends_at)}</b></p>}
  </section>

  <form className="sa-card" onSubmit={save}>
   <h2>상태 바꾸기</h2>
   <div className="sa-modes" role="radiogroup" aria-label="표시할 상태">
    {modes.map(m => <label key={m.id} className={draft.mode===m.id?'active':''}>
     <input type="radio" name="mode" checked={draft.mode===m.id} onChange={()=>setDraft({...draft,mode:m.id})}/>
     <span><b>{m.label}</b><small>{m.desc}</small></span>
    </label>)}
   </div>
   {draft.mode!=='auto'&&<>
    <fieldset className="sa-field"><legend>언제까지 적용할까요?</legend>
     <div className="sa-chips">
      {presets(now).map(p => <button type="button" key={p.label} className={!custom&&end===p.value?'active':''} onClick={()=>{setEnd(p.value);setCustom(false);}}>{p.label}</button>)}
      <button type="button" className={custom?'active':''} onClick={()=>setCustom(true)}>날짜 직접 선택</button>
     </div>
     {custom&&<input type="datetime-local" aria-label="종료 날짜와 시간 (한국 시간)" value={end} onChange={e=>setEnd(e.target.value)} required/>}
     {end&&<p className="sa-hint">→ <b>{whenLabel(fromInput(end))}</b>까지 적용되고, 그 뒤엔 자동 표시로 돌아가요.</p>}
    </fieldset>
    <fieldset className="sa-field"><legend>방문자 안내 문구 <small>(선택)</small></legend>
     <div className="sa-chips small">{templates.map(t => <button type="button" key={t} onClick={()=>setDraft({...draft,message:t})}>{t}</button>)}</div>
     <input maxLength={120} value={draft.message} onChange={e=>setDraft({...draft,message:e.target.value})} placeholder="예: 오늘은 병원 사정으로 휴진합니다." aria-label="방문자 안내 문구"/>
     <p className="sa-hint">외국어 페이지에서는 상태(예: 휴진)만 번역되고, 안내 문구는 한국어 그대로 보여요.</p>
    </fieldset>
   </>}
   <details className="sa-holidays"><summary>설·추석·대체공휴일 등 특별 공휴일 등록</summary>
    <p className="sa-hint">등록한 날짜에는 10:00–17:00 진료시간을 적용합니다. 고정 공휴일과 주말은 자동 반영됩니다. 쉬는 날이면 아래 ‘휴진 예약’을 쓰세요.</p>
    <label>날짜 (한 줄에 하나, 예: 2027-02-06)<textarea rows={5} value={dates} onChange={e=>setDates(e.target.value)} placeholder="2027-02-06"/></label>
   </details>
   <div className="sa-preview-box"><span>저장하면 이렇게 보여요</span><Preview now={now} settings={{...draftSettings,holiday_dates:saved.holiday_dates}} closures={closures}/></div>
   <div className="sa-save"><button className="button" disabled={busy||!dirty}>{busy?'저장 중…':'홈페이지에 반영'}</button>{dirty&&<span className="sa-dirty">저장하지 않은 변경이 있어요</span>}</div>
  </form>

  <section className="sa-card">
   <h2>휴진 예약</h2>
   <p className="sa-hint">미리 등록해 두면 그날 0시부터 자동으로 ‘휴진’이 표시되고, 전날 저녁 6시에 텔레그램으로 알려드려요.</p>
   {closures.length===0?<p className="sa-empty">예약된 휴진이 없어요.</p>:<ul className="sa-list">{closures.map(c => {
    const live = Date.parse(c.starts_at) <= now.getTime();
    return <li key={c.id}><span><b>{rangeLabel(c.starts_at,c.ends_at)}</b>{live&&<em>적용 중</em>}{c.message&&<small>{c.message}</small>}</span><button type="button" disabled={busy} onClick={()=>void removeScheduled(c)}>삭제</button></li>;
   })}</ul>}
   <form className="sa-closure-form" onSubmit={addScheduled}>
    <div className="sa-dates"><label>첫날<input type="date" value={closureStart} min={seoulDate(now).date} onChange={e=>{setClosureStart(e.target.value);if(!closureEnd||closureEnd<e.target.value)setClosureEnd(e.target.value);}} required/></label>
    <label>마지막 날<input type="date" value={closureEnd} min={closureStart||seoulDate(now).date} onChange={e=>setClosureEnd(e.target.value)} required/></label></div>
    <div className="sa-chips small">{templates.slice(0,3).map(t => <button type="button" key={t} onClick={()=>setClosureMessage(t)}>{t}</button>)}</div>
    <input maxLength={120} value={closureMessage} onChange={e=>setClosureMessage(e.target.value)} placeholder="안내 문구 (선택)" aria-label="휴진 안내 문구"/>
    <button className="button secondary" disabled={busy}>휴진 예약 추가</button>
   </form>
  </section>

  <section className="sa-card">
   <h2>최근 변경 기록</h2>
   {events.length===0?<p className="sa-empty">아직 기록이 없어요. 이제부터 바뀐 내용이 여기에 남아요.</p>:<ul className="sa-log">{events.map(e => <li key={e.id}><time>{fmt(e.created_at,{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'})}</time><span>{eventText(e)}</span><small>{e.actor_email.split('@')[0]}</small></li>)}</ul>}
  </section>

  <p className="sa-status" role="status" aria-live="polite">{busy?'처리 중입니다…':notice}</p>
  <p className="sa-footer"><button type="button" onClick={()=>void logout()}>로그아웃</button></p>
 </article>;
}
