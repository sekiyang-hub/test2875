'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';
import {clinic} from '@/config/clinic';
import {bookingLanguages,bookingLocale,localizedBookingError,type BookingStep as Step} from '@/content/booking-languages';
import {appointmentPreview,appointmentsEnabled,normalizePhone,submitAppointment,updateAppointment} from '@/lib/simple-appointments';
type Receipt={name:string;phone:string;date:string;time:string};
export function AppointmentPopup(){
 const pathname=usePathname(),language=bookingLocale(pathname),t=bookingLanguages[language];
 const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null),body=useRef<HTMLDivElement>(null),submission=useRef(''),editToken=useRef('');
 const [open,setOpen]=useState(false),[step,setStep]=useState<Step>('welcome'),[name,setName]=useState(''),[phone,setPhone]=useState(''),[date,setDate]=useState(''),[time,setTime]=useState(''),[consent,setConsent]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState<unknown>(null),[receipt,setReceipt]=useState<Receipt|null>(null),[editing,setEditing]=useState(false),[updated,setUpdated]=useState(false);
 const enabled=appointmentPreview||appointmentsEnabled,allowed=enabled&&!pathname.startsWith('/admin');
 useEffect(()=>{if(!allowed)return;const show=()=>setOpen(true);window.addEventListener('open-appointment',show);return()=>window.removeEventListener('open-appointment',show);},[allowed]);
 useEffect(()=>{if(!allowed)return;const node=dialog.current;if(open&&!node?.open)node?.showModal();else if(!open&&node?.open)node.close();const previous=document.body.style.overflow;if(open)document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous;};},[open,allowed]);
 useEffect(()=>{if(!open)return;body.current?.scrollTo({top:step==='done'?0:body.current.scrollHeight,behavior:'instant'});dialog.current?.querySelector<HTMLInputElement>('input[data-chat-input]')?.focus();},[step,open]);
 function move(next:Step){setError(null);setStep(next);}
 function close(){if(busy)return;setOpen(false);trigger.current?.focus();}
 function reset(){submission.current='';editToken.current='';setReceipt(null);setEditing(false);setUpdated(false);setName('');setPhone('');setDate('');setTime('');setConsent(false);move('welcome');}
 function advance(){setError(null);try{
  if(step==='name'){if(!name.trim())throw new Error('nameError');move(editing?'review':'phone');}
  else if(step==='phone'){normalizePhone(phone);move(editing?'review':'date');}
  else if(step==='date'){const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul'}).format(new Date());if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||date<today||Date.parse(`${date}T00:00:00+09:00`)>Date.now()+60*86400000)throw new Error('dateError');move('time');}
  else if(step==='time'){const stamp=Date.parse(`${date}T${time}:00+09:00`);if(!time||!Number.isFinite(stamp)||stamp<Date.now()+2*3600000||stamp>Date.now()+60*86400000)throw new Error('timeError');move('review');}
 }catch(e){setError(e);}}
 function editReceipt(target:Step='review'){if(!receipt)return;setName(receipt.name);setPhone(receipt.phone);setDate(receipt.date);setTime(receipt.time);setConsent(true);setEditing(true);move(target);}
 function cancelEdit(){if(!receipt)return;setEditing(false);setName(receipt.name);setPhone(receipt.phone);setDate(receipt.date);setTime(receipt.time);setError(null);setStep('done');}
 async function send(){if(busy)return;setError(null);if(!consent){setError(new Error('consentError'));return;}setBusy(true);try{
  const stamp=Date.parse(`${date}T${time}:00+09:00`);normalizePhone(phone);
  if(!name.trim()||!Number.isFinite(stamp)||stamp<Date.now()+2*3600000||stamp>Date.now()+60*86400000)throw new Error('fieldsError');
  const preferredAt=new Date(stamp).toISOString();submission.current||=crypto.randomUUID();editToken.current||=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
  if(!appointmentPreview){const data={id:submission.current,name:name.trim(),phone:normalizePhone(phone),preferredAt,consent,website:'',editToken:editToken.current,language};if(editing)await updateAppointment(data);else await submitAppointment(data);}
  setReceipt({name:name.trim(),phone,date,time});setUpdated(editing);setEditing(false);setStep('done');
 }catch(e){setError(e);}finally{setBusy(false);}}
 if(!allowed)return null;
 const answers=[name&&{label:t.name,value:name,edit:'name' as Step},phone&&{label:t.phone,value:phone,edit:'phone' as Step},date&&{label:t.date,value:date,edit:'date' as Step},time&&date&&{label:t.time,value:time,edit:'time' as Step}].filter(Boolean) as {label:string;value:string;edit:Step}[];
 const currentIndex=['name','phone','date','time','review'].indexOf(step);
 return <>
 <button ref={trigger} lang={t.lang} className="appointment-launcher" aria-haspopup="dialog" aria-expanded={open} aria-controls="appointment-chat" onClick={()=>setOpen(true)}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6 3V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8"/><path d="M7 9h10M7 13h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg><span>{t.shortTitle}<span className="launcher-hint">{t.hint}</span></span></button>
 <dialog lang={t.lang} id="appointment-chat" ref={dialog} className="appointment-chat" aria-labelledby="appointment-chat-title" aria-describedby="appointment-chat-explanation" onCancel={event=>{event.preventDefault();close();}} onClose={()=>setOpen(false)}>
 <div className="chat-shell"><header className="chat-header"><span className="chat-avatar" aria-hidden="true">H</span><div><h2 id="appointment-chat-title">{t.clinicName} · {t.assistant}</h2><p>{t.afterCall}</p></div><button type="button" className="chat-close" onClick={close} disabled={busy} aria-label={t.close}>×</button></header>
 <div className="chat-status" id="appointment-chat-explanation"><span aria-hidden="true">●</span> {t.status}</div>
 {appointmentPreview&&<div className="chat-preview">{t.preview}</div>}
 <div ref={body} className="chat-transcript">
 {step!=='done'&&<div className="chat-bubble bot"><strong>{t.greeting}</strong><p>{t.intro}</p><p>{t.callMedical} <a href={`tel:${clinic.phone}`}>{clinic.phone}</a></p>{language!=='ko'&&<p>{t.languageNote}</p>}</div>}
 {step!=='welcome'&&step!=='done'&&step!=='review'&&answers.slice(0,Math.max(0,currentIndex)).map(answer=><div key={answer.edit} className="chat-answer"><small>{answer.label}</small><p>{answer.value}</p></div>)}
 <div className="chat-bubble bot" role="status" aria-live="polite"><p>{step==='done'?(appointmentPreview?t.previewDone:updated?t.updatedMessage:t.prompts.done):t.prompts[step]}</p>{step==='done'&&<p>{t.notConfirmed}</p>}</div>
 {step==='welcome'&&<div className="chat-welcome-options"><button className="button" onClick={()=>move('name')}>{t.start} <span aria-hidden="true">→</span></button><a href={`tel:${clinic.phone}`}>{t.call}</a><p>{t.notConfirmed}</p></div>}
 {step==='review'&&<div className="chat-summary"><h3>{editing?t.editTitle:t.reviewTitle}</h3>{editing&&<p className="chat-confirm-note">{t.sameRequest}</p>}{answers.map(answer=><div key={answer.edit}><span>{answer.label}</span><strong>{answer.value}</strong><button type="button" onClick={()=>move(answer.edit)} aria-label={`${t.edit}: ${answer.label}`}>{t.edit}</button></div>)}<p className="chat-confirm-note">{t.koreaTime} · {t.availability}</p><details><summary>{t.privacyTitle}</summary><p>{appointmentPreview?t.preview:t.privacyBody} <Link href="/privacy/" target="_blank" rel="noopener noreferrer">{t.privacyLink}</Link></p></details><label className="chat-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} disabled={busy}/>{t.consent}</label><button className="button" onClick={()=>void send()} disabled={busy}>{busy?t.sending:editing?t.save:t.send}</button>{editing&&<button type="button" className="chat-cancel-edit" disabled={busy} onClick={cancelEdit}>{t.cancelEdit}</button>}</div>}
 {step==='done'&&receipt&&<><section className="chat-summary chat-receipt" aria-label={t.receiptTitle}><h3>{updated?t.updatedTitle:t.receiptTitle}</h3>{[{label:t.name,value:receipt.name,target:'name' as Step},{label:t.phone,value:receipt.phone,target:'phone' as Step},{label:t.date,value:receipt.date,target:'date' as Step},{label:t.time,value:receipt.time,target:'time' as Step}].map(item=><div key={item.target}><span>{item.label}</span><strong>{item.value}</strong><button type="button" onClick={()=>editReceipt(item.target)} aria-label={`${t.edit}: ${item.label}`}>{t.edit}</button></div>)}<p className="chat-confirm-note">{t.koreaTime} · {t.pending}</p><button className="button" onClick={()=>editReceipt()}>{language==='ko'?'예약신청':t.editTitle}</button></section><div className="chat-welcome-options"><p>{t.receiptHelp}</p><a href={`tel:${clinic.phone}`}>{t.cancelByPhone}</a><button type="button" onClick={()=>{reset();close();}}>{t.clear}</button></div></>}
 {Boolean(error)&&<p className="chat-error" role="alert">{localizedBookingError(error,t)}</p>}
 </div>
 {['name','phone','date','time'].includes(step)&&<form noValidate className="chat-composer" onSubmit={e=>{e.preventDefault();advance();}}><label htmlFor="chat-answer-input">{step==='name'?t.name:step==='phone'?t.phone:step==='date'?t.date:t.time}{(step==='date'||step==='time')&&` · ${t.koreaTime}`}</label>{step==='time'?<select data-chat-input id="chat-answer-input" value={time} onChange={e=>setTime(e.target.value)} required><option value="">{t.chooseTime}</option>{Array.from({length:23},(_,i)=>`${String(10+Math.floor(i/2)).padStart(2,'0')}:${i%2?'30':'00'}`).map(value=><option key={value}>{value}</option>)}</select>:<input id="chat-answer-input" data-chat-input type={step==='date'?'date':step==='phone'?'tel':'text'} value={step==='name'?name:step==='phone'?phone:date} onChange={e=>{if(step==='name')setName(e.target.value);else if(step==='phone')setPhone(e.target.value);else setDate(e.target.value);}} maxLength={step==='name'?40:step==='phone'?20:undefined} autoComplete={step==='name'?'name':step==='phone'?'tel':'off'} placeholder={step==='name'?t.name:step==='phone'?'01012345678 / +821012345678':undefined} aria-describedby={step==='phone'?'chat-phone-help':undefined} required/>}{step==='phone'&&<p className="chat-confirm-note" id="chat-phone-help">{t.phoneHelp}</p>}<div><button className="chat-back" type="button" onClick={()=>move(editing?'review':step==='name'?'welcome':step==='phone'?'name':step==='date'?'phone':'date')}>{t.back}</button><button className="button" type="submit">{t.next} <span aria-hidden="true">→</span></button></div></form>}
 <footer className="chat-footer">{t.clinicName} · {t.noAccount}</footer></div></dialog></>;
}
