'use client';
import {useState} from 'react';
import {bookingLanguageNames,type BookingLocale} from '@/content/booking-languages';
import {appointmentLabels,appointmentPreview,processAppointment,slotLabel,type Appointment} from '@/lib/simple-appointments';
import {inboxLabel,reminderOptions,type ReminderMinutes} from '@/lib/appointment-inbox';
import {useAppointmentInbox} from './use-appointment-inbox';
import {clinic} from '@/config/clinic';
const samples:Appointment[]=[
 {id:'preview-1',patient_name:'체험 환자',phone:'+821000000000',preferred_at:'2026-10-28T05:00:00Z',confirmed_at:null,status:'pending',created_at:'2026-10-26T01:00:00Z',updated_at:'2026-10-26T01:00:00Z',patient_revision:1,staff_seen_revision:0,patient_changed_at:'2026-10-26T01:00:00Z',needs_review:true},
 {id:'preview-2',patient_name:'예시 환자',phone:'+821000000000',preferred_at:'2026-10-29T02:00:00Z',confirmed_at:null,status:'contact_failed',created_at:'2026-10-26T00:00:00Z',updated_at:'2026-10-26T00:00:00Z',patient_revision:2,staff_seen_revision:1,patient_changed_at:'2026-10-26T01:00:00Z',needs_review:true}
];

type Filter='waiting'|'unread'|'handled'|'all';
const filters:{id:Filter;label:string}[]=[{id:'waiting',label:'처리 대기'},{id:'unread',label:'미확인'},{id:'handled',label:'처리됨'},{id:'all',label:'전체'}];
const statusTone:Record<string,string>={pending:'new',done:'ok',contact_failed:'warn',confirmed:'ok',rejected:'off',cancelled:'off'};
const statusShort:Record<string,string>={pending:'접수',done:'처리 완료',contact_failed:'연락 필요',confirmed:'확정',rejected:'접수 불가',cancelled:'취소'};
const KST=9*3600000,DAY=86400000;
const kstDay=(iso:string)=>Math.floor((Date.parse(iso)+KST)/DAY);
const time=(iso:string)=>new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(iso));
const dateLabel=(iso:string)=>new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'long',day:'numeric',weekday:'short'}).format(new Date(iso));
const shortDate=(iso:string)=>new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',weekday:'short'}).format(new Date(iso));
function phoneLabel(raw:string){const m=raw.match(/^\+82(10)(\d{4})(\d{4})$/);return m?`0${m[1]}-${m[2]}-${m[3]}`:raw;}
function ago(iso:string,now:number){const min=Math.max(0,Math.round((now-Date.parse(iso))/60000));if(min<1)return '방금';if(min<60)return `${min}분 전`;const h=Math.round(min/60);if(h<24)return `${h}시간 전`;return `${Math.round(h/24)}일 전`;}
function smsTemplates(row:Appointment){
 const head=`[${clinic.name}] ${row.patient_name}님,`,call=`${clinic.phone}로 연락 부탁드립니다.`;
 const list=[{label:'부재중 안내',body:`${head} 예약 신청 확인차 전화드렸는데 연결되지 않았습니다. 편하실 때 ${call}`}];
 list.push({label:'예약 안내',body:`${head} ${slotLabel(row.preferred_at)} 예약 신청 확인되었습니다. 변경이 필요하시면 ${clinic.phone}로 연락 주세요.`});
 list.push({label:'시간 조율',body:`${head} 희망하신 ${slotLabel(row.preferred_at)}은 예약이 어렵습니다. 가능한 시간을 안내드리려 하니 ${call}`});
 return [...list,{label:'직접 쓰기',body:''}];
}
const smsHref=(phone:string,body:string)=>`sms:${phone}${body?`?body=${encodeURIComponent(body)}`:''}`;
const slotOf=(row:Appointment)=>row.status==='confirmed'&&row.confirmed_at?row.confirmed_at:row.preferred_at;
const waitingStatus=(status:string)=>status==='pending'||status==='contact_failed';
const reopenable=(status:string)=>['done','rejected','cancelled'].includes(status);
function matches(row:Appointment,filter:Filter){
 if(filter==='all')return true;
 if(filter==='unread')return row.needs_review;
 if(filter==='handled')return !waitingStatus(row.status);
 return waitingStatus(row.status);
}
function groupRows(rows:Appointment[],now:number){
 const today=kstDay(new Date(now).toISOString());
 const sorted=[...rows].sort((a,b)=>Date.parse(slotOf(a))-Date.parse(slotOf(b)));
 const upcoming=new Map<number,Appointment[]>(),past:Appointment[]=[];
 for(const row of sorted){const day=kstDay(slotOf(row));if(day<today)past.push(row);else upcoming.set(day,[...(upcoming.get(day)||[]),row]);}
 const groups=[...upcoming.entries()].map(([day,items])=>{
  const prefix=day===today?'오늘':day===today+1?'내일':day===today+2?'모레':'';
  return {key:String(day),title:prefix,subtitle:dateLabel(slotOf(items[0])),items,past:false};
 });
 if(past.length)groups.push({key:'past',title:'지난 날짜',subtitle:'희망 시간이 이미 지났어요',items:past.reverse(),past:true});
 return groups;
}

export function BookingAdmin(){
 const inbox=useAppointmentInbox(samples);
 const {rows,token}=inbox;
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[filter,setFilter]=useState<Filter>('waiting'),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false);
 const [undo,setUndo]=useState<{id:string;name:string}|null>(null);
 async function run(fn:()=>Promise<void>){setBusy(true);setNotice('');setUndo(null);try{await fn();}catch(e){setNotice((e as Error).message);}finally{setBusy(false);}}
 const doneMessage:Record<string,string>={done:'처리 완료',contact_failed:'연락 안 됨',rejected:'접수 불가',cancelled:'취소',pending:'처리 대기'};
 function act(row:Appointment,status:string){void run(async()=>{
  if(appointmentPreview)inbox.setRows(current=>current.map(r=>r.id===row.id?{...r,status,staff_seen_revision:r.patient_revision,needs_review:false}:r));
  else{await processAppointment(token,row,status,null,false);await inbox.refresh();}
  setNotice(`${row.patient_name} 님 → ${doneMessage[status]||status}${appointmentPreview?' (체험 화면에만 반영)':''}`);
  if(reopenable(status))setUndo({id:row.id,name:row.patient_name});
 });}
 function reopen(id:string){const row=rows.find(r=>r.id===id);if(row)act(row,'pending');}
 // eslint-disable-next-line react-hooks/purity -- rows refresh every 5s, which re-renders relative times.
 const now=Date.now();
 const counts=Object.fromEntries(filters.map(f=>[f.id,rows.filter(r=>matches(r,f.id)).length])) as Record<Filter,number>;
 const groups=groupRows(rows.filter(r=>matches(r,filter)),now);
 const loggedIn=Boolean(token)||appointmentPreview;
 const offline=/원활|만료/.test(inbox.connection);

 if(!loggedIn)return <article className="container content booking-page ba">
  <h1 className="ba-login-title">예약 신청 관리</h1>
  <form className="booking-card ba-login" onSubmit={e=>{e.preventDefault();void run(async()=>{try{await inbox.login(email,password);}finally{setPassword('');}});}}>
   <label>관리자 이메일<input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)}/></label>
   <label>비밀번호<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></label>
   <button className="button" disabled={busy}>로그인</button><p role="status">{busy?'로그인 중입니다…':notice||inbox.connection}</p>
  </form>
 </article>;

 return <article className="container booking-page ba">
  {appointmentPreview&&<aside className="preview-banner">관리자 체험 · 아래 내용은 예시이며 실제 환자 정보가 아닙니다. 변경은 화면에서만 반영됩니다.</aside>}
  <header className="ba-top">
   <div className="ba-title">
    <h1>예약 신청</h1>
    <p className={`ba-live${offline?' is-off':''}`} role="status"><span aria-hidden="true"/>{appointmentPreview?'예시 화면':offline?inbox.connection:'자동 확인 중'}{inbox.lastChecked&&!offline&&` · ${inbox.lastChecked}`}</p>
   </div>
   <div className="ba-top-actions">
    {inbox.sound
     ?<button className="ba-icon on" onClick={inbox.disableSound} title="알림음 끄기">🔔<span>알림 켜짐</span></button>
     :<button className="ba-icon attention" onClick={()=>void inbox.enableSound()} title="알림음 켜기">🔕<span>알림 켜기</span></button>}
    {appointmentPreview
     ?<button className="ba-icon" onClick={inbox.simulate}>＋<span>새 신청 체험</span></button>
     :<button className="ba-icon" disabled={busy} onClick={()=>void run(inbox.refresh)} title="지금 새로고침">↻<span>새로고침</span></button>}
   </div>
  </header>

  {inbox.unread>0&&filter!=='unread'&&<button className="ba-alert" onClick={()=>setFilter('unread')}><strong>새로 들어온 신청 {inbox.unread}건</strong><span>눌러서 확인하기 →</span></button>}
  {inbox.soundNotice&&<p className="ba-sound-note" role="status">{inbox.soundNotice}</p>}

  <nav className="ba-tabs" aria-label="신청 구분">
   {filters.map(f=><button key={f.id} aria-pressed={filter===f.id} className={filter===f.id?'active':''} onClick={()=>setFilter(f.id)}>
    {f.label}<b className={f.id==='unread'&&counts.unread?'hot':''}>{counts[f.id]}</b>
   </button>)}
  </nav>

  <p className="ba-status" role="status" aria-live="polite">{busy?'처리 중입니다…':notice}{!busy&&undo&&<button className="ba-undo" onClick={()=>reopen(undo.id)}>되돌리기</button>}</p>

  {groups.length===0&&<div className="ba-empty"><strong>{filter==='waiting'?'처리할 신청이 없어요 👍':'표시할 신청이 없어요'}</strong><span>새 신청이 오면 이 화면에 자동으로 나타납니다.</span></div>}

  {groups.map(group=><section key={group.key} className={`ba-group${group.past?' is-past':''}`}>
   <h2 className="ba-day">{group.title&&<em>{group.title}</em>}{group.subtitle}<span>{group.items.length}건</span></h2>
   {group.items.map(row=>{
    const slotAt=slotOf(row),passed=Date.parse(slotAt)<now,closed=reopenable(row.status);
    const lang=row.request_language||'ko';
    return <div key={row.id} className={`ba-card tone-${statusTone[row.status]||'off'}${row.needs_review?' is-unread':''}${closed?' is-closed':''}`}>
     <div className="ba-when">
      <strong>{time(slotAt)}</strong>
      <span>{shortDate(slotAt)}</span>
      {passed&&waitingStatus(row.status)&&<em>시간 지남</em>}
     </div>
     <div className="ba-body">
      <div className="ba-name-row">
       <strong className="ba-name">{row.patient_name}</strong>
       <span className="ba-chip">{statusShort[row.status]||appointmentLabels[row.status]||row.status}</span>
       {row.needs_review&&<span className={`ba-chip flag${row.patient_revision>1?' edited':''}`}>{inboxLabel(row)}</span>}
       {lang!=='ko'&&<span className="ba-chip lang">{bookingLanguageNames[lang as BookingLocale]||lang}</span>}
      </div>
      <p className="ba-meta">
       접수 {ago(row.created_at,now)}
       {row.patient_revision>1&&<> · <span className="ba-edited">환자 수정 {slotLabel(row.patient_changed_at)}</span></>}
       {row.status==='confirmed'&&row.confirmed_at!==null&&row.confirmed_at!==row.preferred_at&&<> · 원래 희망 {slotLabel(row.preferred_at)}</>}
      </p>
      <div className="ba-actions">
       {appointmentPreview?<span className="ba-fake-call">예시 번호 · 전화 연결 없음</span>:<><a className="button ba-call" href={`tel:${row.phone}`}>{phoneLabel(row.phone)}</a>
        <details className="ba-sms"><summary className="button secondary">문자</summary><div className="ba-sms-menu" role="menu">
         {smsTemplates(row).map(t=><a key={t.label} role="menuitem" href={smsHref(row.phone,t.body)} onClick={e=>{(e.currentTarget.closest('details') as HTMLDetailsElement|null)?.removeAttribute('open');}}><strong>{t.label}</strong>{t.body&&<span>{t.body}</span>}</a>)}
        </div></details></>}
       {!closed&&<button className="button ba-confirm" disabled={busy} onClick={()=>act(row,'done')}>처리 완료</button>}
       {row.needs_review&&<button className="button secondary ba-seen" disabled={busy} onClick={()=>void run(async()=>{await inbox.markSeen(row);setNotice('확인 표시를 했어요. 연락을 마치면 처리 완료를 눌러 주세요.');})}>확인했어요</button>}
      </div>
      <div className="ba-more">
       {closed?<button disabled={busy} onClick={()=>act(row,'pending')}>처리 대기로 되돌리기</button>:<>
        {row.status==='pending'&&<button disabled={busy} onClick={()=>act(row,'contact_failed')}>연락 안 됨</button>}
        <button disabled={busy} onClick={()=>act(row,'rejected')}>접수 불가</button>
        <button disabled={busy} onClick={()=>act(row,'cancelled')}>취소</button>
       </>}
      </div>
     </div>
    </div>;
   })}
  </section>)}

  <details className="ba-settings">
   <summary>알림 설정 · 사용 안내</summary>
   <div className="ba-settings-body">
    <label className="inbox-reminder">확인 안 한 신청 반복 알림<select value={inbox.reminderMinutes} onChange={e=>inbox.changeReminder(Number(e.target.value) as ReminderMinutes)}>{reminderOptions.map(minutes=><option key={minutes} value={minutes}>{minutes===0?'반복 끄기':`${minutes}분마다`}</option>)}</select></label>
    {inbox.sound&&<button className="button secondary" onClick={inbox.testSound}>알림음 테스트</button>}
    <ul>
     <li>새 신청·환자 수정이 들어오면 소리로 알려드려요. {inbox.reminderMinutes>0?`확인 안 한 신청이 남아 있으면 ${inbox.reminderMinutes}분마다 한 번 더 울립니다.`:'반복 알림은 꺼져 있어요.'}</li>
     <li>실제 예약은 덴트웹에 등록해 주세요. 이 화면은 홈페이지 신청을 받아 연락했는지 정리하는 곳입니다.</li>
     <li>통화나 문자로 연락을 마치면 &lsquo;처리 완료&rsquo;를 누르세요. 잘못 눌렀으면 바로 &lsquo;되돌리기&rsquo;를 누르면 됩니다.</li>
     <li>&lsquo;확인했어요&rsquo;는 알림만 멈추는 표시입니다. 전화번호 인증이 없는 신청이니 꼭 본인 확인 후 예약해 주세요. 자동 문자는 보내지 않습니다.</li>
     <li>이 화면과 PC를 켜 두세요. 화면을 닫거나 절전 상태면 알림이 멈춥니다.</li>
     <li>최근 300건까지 불러옵니다.</li>
    </ul>
    {appointmentPreview
     ?<button className="button secondary" onClick={()=>{inbox.setRows(samples);setUndo(null);setNotice('예시 화면을 초기화했습니다.');}}>체험 초기화</button>
     :<button className="button secondary" disabled={busy} onClick={()=>void run(async()=>{await inbox.logout();})}>로그아웃</button>}
   </div>
  </details>
 </article>;
}
