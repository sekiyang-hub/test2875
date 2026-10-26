'use client';
import Link from 'next/link';
import {clinic} from '@/config/clinic';
import {languages} from '@/content/languages';
import {bookingLanguages,type BookingLocale} from '@/content/booking-languages';
import {appointmentPreview,appointmentsEnabled} from '@/lib/simple-appointments';
export function BookingAssistant({language='ko'}:{language?:BookingLocale}){
 const t=bookingLanguages[language],guide=language==='ko'?null:languages[language];
 return <article lang={t.lang} className="container content booking-page simple-booking"><span className="eyebrow">YEONSU HAPPY Dental Clinic</span><h1>{t.title}</h1><p className="booking-lead">{t.intro}<br/>{t.afterCall}</p>
 {appointmentPreview&&<aside className="preview-banner">{t.preview}</aside>}
 <ol className="appointment-steps" aria-label={t.how}>{t.steps.map((label,index)=><li key={index}><span>{index+1}</span>{label}</li>)}</ol>
 <section className="booking-card chat-intro-card"><div className="chat-intro-symbol" aria-hidden="true">H</div><h2>{t.assistant}</h2><p>{t.intro}<br/>{t.noAccount}</p>{appointmentPreview||appointmentsEnabled?<button className="button" onClick={()=>window.dispatchEvent(new Event('open-appointment'))}>{t.start} <span aria-hidden="true">↗</span></button>:<p>{t.unavailable}</p>}</section>
 <div className="notice"><strong>{t.notConfirmed}</strong><p>{t.callMedical} <a href={`tel:${clinic.phone}`}>{clinic.phone}</a></p></div>
 <section className="booking-explainer"><h2>{t.how}</h2><p>{t.availability} {t.koreaTime}</p><p>{t.receiptHelp}</p>{guide&&<p>{t.languageNote}</p>}<p>{guide?.address||clinic.address.full}</p><p>{clinic.hours.map((h,index)=><span key={h.label} className="booking-hours-line">{guide?(index===0?guide.weekdays:guide.weekends):h.label} {h.open}–{h.close}<br/></span>)}</p><Link href={guide?`/guide/${language}/#guide-location`:'/location/'}>{guide?.directions||'오시는 길 확인하기'} →</Link></section></article>;
}
