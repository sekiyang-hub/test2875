'use client';
import {useState} from 'react';
import {appointmentLabels,appointmentPreview,processAppointment,slotLabel,type Appointment} from '@/lib/simple-appointments';
import {inboxLabel} from '@/lib/appointment-inbox';
import {useAppointmentInbox} from './use-appointment-inbox';
const samples:Appointment[]=[
 {id:'preview-1',patient_name:'체험 환자',phone:'+821000000000',preferred_at:'2026-10-28T05:00:00Z',confirmed_at:null,status:'pending',created_at:'2026-10-26T01:00:00Z',updated_at:'2026-10-26T01:00:00Z',patient_revision:1,staff_seen_revision:0,patient_changed_at:'2026-10-26T01:00:00Z',needs_review:true},
 {id:'preview-2',patient_name:'예시 환자',phone:'+821000000000',preferred_at:'2026-10-29T02:00:00Z',confirmed_at:null,status:'contact_failed',created_at:'2026-10-26T00:00:00Z',updated_at:'2026-10-26T00:00:00Z',patient_revision:2,staff_seen_revision:1,patient_changed_at:'2026-10-26T01:00:00Z',needs_review:true}
];
export function BookingAdmin(){
 const inbox=useAppointmentInbox(samples);
 const {rows,token}=inbox;
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[filter,setFilter]=useState('waiting'),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false);
 const [decision,setDecision]=useState<{row:Appointment;status:string}|null>(null),[time,setTime]=useState(''),[contacted,setContacted]=useState(false);
 async function run(fn:()=>Promise<void>){setBusy(true);setNotice('');try{await fn();}catch(e){setNotice((e as Error).message);}finally{setBusy(false);}}
 function choose(row:Appointment,status:string){setDecision({row,status});setContacted(false);setTime(new Date(Date.parse(row.confirmed_at||row.preferred_at)+9*3600000).toISOString().slice(0,16));}
 const visible=rows.filter(row=>filter==='all'||(filter==='unread'?row.needs_review:['pending','contact_failed'].includes(row.status)));
 return <article className="container content booking-page"><h1>예약 신청 관리</h1>
 {appointmentPreview&&<aside className="preview-banner">관리자 체험 · 아래 내용은 예시이며 실제 환자 정보가 아닙니다. 변경은 화면에서만 반영됩니다.</aside>}
 <p>신청 내용을 확인하고 환자에게 전화한 뒤 예약을 확정해 주세요.</p>
 <div className="notice">전화번호 인증을 하지 않은 신청입니다. 통화로 본인과 희망 시간을 확인하고 실제 진료 일정과 대조하세요. 자동 문자나 AI는 사용하지 않습니다.</div>
 {!token&&!appointmentPreview?<form className="booking-card" onSubmit={e=>{e.preventDefault();void run(async()=>{try{await inbox.login(email,password);}finally{setPassword('');}});}}>
  <label>관리자 이메일<input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)}/></label>
  <label>비밀번호<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></label>
  <button className="button" disabled={busy}>로그인</button><p role="status">{inbox.connection}</p>
 </form>:<>
  <section className={`inbox-dashboard${inbox.unread?' has-unread':''}`} aria-label="예약 알림">
   <div className="inbox-heading"><h2 aria-live="polite">미확인 신청 <strong>{inbox.unread}건</strong></h2><button className="button secondary" onClick={()=>setFilter('unread')}>미확인만 보기</button></div>
   <p className="inbox-connection" role="status">{appointmentPreview?'예시 화면 · 실제 자동 조회 없음':inbox.connection}{inbox.lastChecked&&` · 마지막 확인 ${inbox.lastChecked}`}</p>
   <div className="inbox-controls">
    {inbox.sound?<><button className="button secondary" onClick={inbox.disableSound}>알림 끄기</button><button className="button secondary" onClick={inbox.chime}>알림음 테스트</button></>:<button className="button" onClick={()=>void inbox.enableSound()}>알림 켜기 · 소리 확인</button>}
    {appointmentPreview&&<button className="button secondary" onClick={inbox.simulate}>새 신청 알림 체험</button>}
   </div>
   <p className="inbox-help" role="status">{inbox.soundNotice||'알림 켜기를 한 번 눌러 소리 재생을 허용해 주세요.'}</p>
   <p className="inbox-help">직원 화면과 PC를 켜 두세요. 화면을 닫거나 PC가 절전 상태이면 알림이 중단됩니다. 다른 탭에서는 브라우저에 따라 확인이 늦어질 수 있습니다. 소리와 화면 표시는 예약 확정을 의미하지 않습니다.</p>
  </section>
  <div className="booking-toolbar">{appointmentPreview?<button className="button secondary" onClick={()=>{inbox.setRows(samples);setDecision(null);setNotice('예시 화면을 초기화했습니다.');}}>체험 초기화</button>:<>
   <button className="button secondary" disabled={busy} onClick={()=>void run(inbox.refresh)}>지금 확인</button>
   <button className="button secondary" disabled={busy} onClick={()=>void run(async()=>{try{await inbox.logout();}finally{setDecision(null);}})}>로그아웃</button>
  </>}</div>
  <section className="booking-card"><h2>신청 목록</h2><p className="inbox-help">미확인 신청을 먼저 불러옵니다. 표시 건수는 현재 불러온 최대 300건 기준입니다. ‘내용 확인했어요’는 직원 간 확인 표시이며 예약 확정과 다릅니다.</p>
   <label>조회 범위<select value={filter} onChange={e=>setFilter(e.target.value)}><option value="waiting">연락·확인 필요</option><option value="unread">미확인 신청</option><option value="all">전체</option></select></label>
   {visible.length===0&&<p>표시할 신청이 없습니다.</p>}
   {visible.map(row=><div className={`booking-item${row.needs_review?' inbox-unread':''}`} key={row.id}>
    {row.needs_review&&<div className="inbox-item-heading"><span className={`inbox-badge${row.patient_revision>1?' edited':''}`}>{inboxLabel(row)}</span><button className="button secondary" disabled={busy} onClick={()=>void run(async()=>{await inbox.markSeen(row);setNotice('내용 확인 표시를 저장했습니다. 예약은 통화 후 별도로 확정해 주세요.');})}>내용 확인했어요</button></div>}
    <strong>{appointmentLabels[row.status]} · {row.patient_name}</strong>
    {row.patient_revision>1&&<p className="inbox-edit-time">환자 수정: {slotLabel(row.patient_changed_at)}</p>}
    <p>{appointmentPreview?<span>예시 전화번호 · 전화 연결 없음</span>:<a className="button secondary" href={`tel:${row.phone}`}>{row.phone} 전화하기</a>}</p>
    <p>희망: {slotLabel(row.preferred_at)}</p>{row.confirmed_at&&<p>확정: {slotLabel(row.confirmed_at)}</p>}
    {!['cancelled','rejected'].includes(row.status)&&<><button className="button" disabled={busy} onClick={()=>choose(row,'confirmed')}>{row.status==='confirmed'?'확정 시간 변경':'전화 확인 후 확정'}</button><button className="button secondary" disabled={busy} onClick={()=>choose(row,'contact_failed')}>연락 필요</button><button className="button secondary" disabled={busy} onClick={()=>choose(row,'rejected')}>접수 불가</button><button className="button secondary" disabled={busy} onClick={()=>choose(row,'cancelled')}>취소</button></>}
    {decision?.row.id===row.id&&<form className="booking-review" onSubmit={e=>{e.preventDefault();void run(async()=>{
     const stamp=decision.status==='confirmed'?new Date(`${time}:00+09:00`).toISOString():null;
     if(decision.status==='confirmed'&&(!contacted||!stamp||Date.parse(stamp)<=Date.now()))throw new Error('미래 시간과 통화 확인을 체크해 주세요.');
     if(appointmentPreview){inbox.setRows(current=>current.map(r=>r.id===row.id?{...r,status:decision.status,confirmed_at:stamp||r.confirmed_at,staff_seen_revision:r.patient_revision,needs_review:false}:r));}
     else{await processAppointment(token,decision.row,decision.status,stamp,contacted);await inbox.refresh();}
     setDecision(null);setNotice(appointmentPreview?'체험 화면에만 반영했습니다. 실제 예약이나 문자는 발생하지 않았습니다.':'저장했습니다. 환자에게 통화로 안내해 주세요.');
    });}}><h3>{appointmentLabels[decision.status]} 처리</h3>
     {decision.status==='confirmed'&&<><label>환자와 합의한 확정 시간 (한국 시간)<input type="datetime-local" required value={time} onChange={e=>setTime(e.target.value)}/></label><label className="booking-check"><input type="checkbox" required checked={contacted} onChange={e=>setContacted(e.target.checked)}/>환자와 통화했고 병원 일정과 중복이 없음을 확인했습니다.</label></>}
     <button className="button" disabled={busy}>확인하고 저장</button><button type="button" className="button secondary" onClick={()=>setDecision(null)}>돌아가기</button>
    </form>}
   </div>)}
  </section>
 </>}
 <p role="status" aria-live="polite">{busy?'처리 중입니다…':notice}</p></article>;
}
