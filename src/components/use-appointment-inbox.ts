'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {loginStatusSession,logoutStatus,refreshStatusSession,StatusAuthError,type StaffSession} from '@/lib/status-store';
import {acknowledgeAppointment,appointmentPreview,listAppointments,type Appointment} from '@/lib/simple-appointments';
import {incomingRevisions,nextInboxAlert,unreadAppointments,type ReminderMinutes} from '@/lib/appointment-inbox';

export function useAppointmentInbox(samples:Appointment[]){
 const [rows,setRows]=useState<Appointment[]>(appointmentPreview?samples:[]);
 const [token,setToken]=useState(''),[connection,setConnection]=useState('로그인 후 자동 확인을 시작합니다.');
 const [lastChecked,setLastChecked]=useState(''),[sound,setSound]=useState(false),[soundNotice,setSoundNotice]=useState('');
 const [reminderMinutes,setReminderMinutes]=useState<ReminderMinutes>(3);
 const reminderPeriod=useRef<ReminderMinutes>(3),lastAlertAt=useRef<number|null>(null);
 const session=useRef<StaffSession|null>(null),epoch=useRef(0),flight=useRef<Promise<void>|null>(null);
 const versions=useRef(new Map<string,number>()),initialized=useRef(false);
 const audio=useRef<AudioContext|null>(null),soundOn=useRef(false);
 const chime=useCallback(()=>{
  const ctx=audio.current;
  if(!ctx||ctx.state!=='running'){if(soundOn.current){setSound(false);soundOn.current=false;setSoundNotice('소리가 일시 중지됐습니다. 알림 켜기를 다시 눌러 주세요.');}return;}
  [784,659].forEach((frequency,index)=>{
   const oscillator=ctx.createOscillator(),gain=ctx.createGain(),start=ctx.currentTime+index*.22;
   oscillator.frequency.value=frequency;gain.gain.setValueAtTime(0,start);
   gain.gain.linearRampToValueAtTime(.15,start+.015);gain.gain.exponentialRampToValueAtTime(.001,start+.4);
   oscillator.connect(gain);gain.connect(ctx.destination);oscillator.start(start);oscillator.stop(start+.42);
   oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
  });
 },[]);
 const receive=useCallback((next:Appointment[])=>{
  const hasUnread=unreadAppointments(next).length>0,now=Date.now();
  const kind=nextInboxAlert({hasUnread,incoming:initialized.current&&incomingRevisions(versions.current,next).length>0,sound:soundOn.current,minutes:reminderPeriod.current,lastAlertAt:lastAlertAt.current,now});
  if(kind){chime();lastAlertAt.current=now;if(kind==='reminder')setSoundNotice('미확인 신청이 남아 있어 다시 알려드렸습니다. 내용을 확인해 주세요.');}
  if(!hasUnread)lastAlertAt.current=null;
  else if(soundOn.current&&lastAlertAt.current===null)lastAlertAt.current=now;
  for(const row of next)versions.current.set(row.id,row.patient_revision);
  initialized.current=true;setRows(next);
  setLastChecked(new Date().toLocaleTimeString('ko-KR',{hour12:false}));
 },[chime]);
 const refresh=useCallback(()=>{
  if(appointmentPreview)return Promise.resolve();
  if(flight.current)return flight.current;
  const currentEpoch=epoch.current;
  const job=(async()=>{
   try{
    let current=session.current;if(!current)return;
    if(current.expiresAt<Date.now()+60000){
     current=await refreshStatusSession(current.refreshToken);
     if(epoch.current!==currentEpoch)return;
     session.current=current;setToken(current.accessToken);
    }
    const next=await listAppointments(current.accessToken);
    if(epoch.current!==currentEpoch)return;
    receive(next);setConnection('자동 확인 중 · 5초 간격');
   }catch(error){
    if(epoch.current!==currentEpoch)return;
    if(error instanceof StatusAuthError||/로그인.*만료/.test((error as Error).message)){
     epoch.current++;session.current=null;setToken('');setRows([]);setSound(false);soundOn.current=false;lastAlertAt.current=null;
     setConnection('로그인이 만료됐습니다. 다시 로그인해 주세요.');
    }else setConnection('연결이 원활하지 않습니다. 자동으로 재시도합니다.');
    throw error;
   }
  })();
  flight.current=job;
  void job.finally(()=>{if(flight.current===job)flight.current=null;}).catch(()=>{});
  return job;
 },[receive]);
 async function login(email:string,password:string){
  const next=await loginStatusSession(email,password);
  epoch.current++;session.current=next;versions.current.clear();initialized.current=false;flight.current=null;
  setToken(next.accessToken);await refresh();
 }
 async function logout(){
  const current=session.current;
  epoch.current++;session.current=null;setToken('');setRows([]);versions.current.clear();initialized.current=false;
  flight.current=null;soundOn.current=false;lastAlertAt.current=null;setSound(false);setConnection('로그아웃했습니다.');
  if(current)await logoutStatus(current.accessToken);
 }
 async function markSeen(row:Appointment){
  if(appointmentPreview){setRows(current=>current.map(r=>r.id===row.id?{...r,staff_seen_revision:row.patient_revision,needs_review:r.patient_revision>row.patient_revision}:r));return;}
  await refresh();const current=session.current;if(!current)throw new Error('다시 로그인해 주세요.');
  await acknowledgeAppointment(current.accessToken,row);await refresh();
 }
 async function enableSound(){
  try{audio.current??=new AudioContext();await audio.current.resume();
   if(audio.current.state!=='running')throw new Error('재생 권한을 확인해 주세요.');
   soundOn.current=true;lastAlertAt.current=Date.now();setSound(true);setSoundNotice('알림음이 켜졌습니다. 새 신청과 환자 수정 시 소리가 납니다.');chime();
  }catch{setSound(false);soundOn.current=false;setSoundNotice('소리를 재생하지 못했습니다. 브라우저 음소거와 스피커를 확인해 주세요.');}
 }
 function disableSound(){soundOn.current=false;lastAlertAt.current=null;setSound(false);setSoundNotice('알림음이 꺼졌습니다. 목록과 미확인 표시는 계속 갱신됩니다.');}
 function changeReminder(minutes:ReminderMinutes){reminderPeriod.current=minutes;setReminderMinutes(minutes);lastAlertAt.current=Date.now();}
 function testSound(){chime();lastAlertAt.current=Date.now();}
 useEffect(()=>{
  if(!appointmentPreview||!sound)return;
  const timer=window.setInterval(()=>receive(rows),5000);
  return ()=>clearInterval(timer);
 },[sound,rows,receive]);
 useEffect(()=>{
  if(!token||appointmentPreview)return;
  const check=()=>{void refresh().catch(()=>{});};
  const timer=window.setInterval(check,5000);
  window.addEventListener('online',check);window.addEventListener('focus',check);
  const onVisible=()=>{if(document.visibilityState==='visible')check();};
  document.addEventListener('visibilitychange',onVisible);
  return ()=>{clearInterval(timer);window.removeEventListener('online',check);window.removeEventListener('focus',check);document.removeEventListener('visibilitychange',onVisible);};
 },[token,refresh]);
 const unread=unreadAppointments(rows).length;
 useEffect(()=>{
  const title=document.title;document.title=unread?`(${unread}) 미확인 예약 신청 | 연수행복치과`:'예약 신청 관리 | 연수행복치과';
  return ()=>{document.title=title;};
 },[unread]);
 useEffect(()=>()=>{epoch.current++;session.current=null;void audio.current?.close().catch(()=>{});},[]);
 function simulate(){
  const now=new Date().toISOString();
  const next=[{...samples[0],id:crypto.randomUUID(),patient_name:'새 신청 체험',created_at:now,updated_at:now,patient_changed_at:now},...rows];
  if(!initialized.current){for(const row of rows)versions.current.set(row.id,row.patient_revision);initialized.current=true;}
  receive(next);
 }
 return {rows,setRows,token,connection,lastChecked,sound,soundNotice,unread,reminderMinutes,changeReminder,refresh,login,logout,markSeen,enableSound,disableSound,testSound,simulate};
}
