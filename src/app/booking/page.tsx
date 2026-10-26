import {BookingAssistant} from '@/components/booking-assistant';
import {JsonLd} from '@/components/structured-data';
import {siteURL} from '@/config/clinic';
import {languages} from '@/content/languages';
import {metadata} from '@/lib/seo';
import {appointmentsEnabled,appointmentPreview} from '@/lib/simple-appointments';
const description='연수행복치과의원 간편 예약 신청. 이름, 연락처, 희망 시간을 남기면 직원이 전화로 확인 후 예약을 확정합니다. 변경·취소는 병원 전화로 문의하세요.';
export const generateMetadata=()=>({...metadata('간편 예약 신청 · 직원 전화 확인 후 확정',description,'/booking/'),alternates:{canonical:`${siteURL}/booking/`,languages:{ko:`${siteURL}/booking/`,...Object.fromEntries(Object.entries(languages).map(([code,entry])=>[entry.lang,`${siteURL}/guide/${code}/booking/`]))}},robots:{index:appointmentsEnabled&&!appointmentPreview,follow:true}});
export default function BookingPage(){return <><JsonLd data={{'@context':'https://schema.org','@type':'WebPage','@id':`${siteURL}/booking/#webpage`,url:`${siteURL}/booking/`,name:'간편 예약 신청',description,inLanguage:'ko-KR',about:{'@id':`${siteURL}/#clinic`}}}/><BookingAssistant/></>;}
