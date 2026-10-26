import {notFound} from 'next/navigation';
import {BookingAssistant} from '@/components/booking-assistant';
import {JsonLd} from '@/components/structured-data';
import {languages,type Language} from '@/content/languages';
import {bookingLanguages} from '@/content/booking-languages';
import {metadata} from '@/lib/seo';
import {siteURL} from '@/config/clinic';
import {appointmentsEnabled,appointmentPreview} from '@/lib/simple-appointments';
export const dynamicParams=false;
export function generateStaticParams(){return Object.keys(languages).map(language=>({language}));}
async function getLanguage(params:Promise<{language:string}>){const {language}=await params;if(!Object.hasOwn(languages,language))notFound();return language as Language;}
export async function generateMetadata({params}:{params:Promise<{language:string}>}){
 const language=await getLanguage(params),t=bookingLanguages[language],path=`/guide/${language}/booking/`,result=metadata(t.title,t.notConfirmed,path);
 return {...result,robots:{index:appointmentsEnabled&&!appointmentPreview,follow:true},alternates:{canonical:`${siteURL}${path}`,languages:{ko:`${siteURL}/booking/`,...Object.fromEntries(Object.entries(languages).map(([code,entry])=>[entry.lang,`${siteURL}/guide/${code}/booking/`]))}},openGraph:{...result.openGraph,locale:{en:'en_US',zh:'zh_CN',vi:'vi_VN',mn:'mn_MN',ne:'ne_NP',ru:'ru_RU',uz:'uz_UZ',th:'th_TH'}[language]}};
}
export default async function BookingPage({params}:{params:Promise<{language:string}>}){
 const language=await getLanguage(params),t=bookingLanguages[language],url=`${siteURL}/guide/${language}/booking/`;
 return <><JsonLd data={{'@context':'https://schema.org','@type':'WebPage','@id':`${url}#webpage`,url,name:t.title,description:t.notConfirmed,inLanguage:t.lang,about:{'@id':`${siteURL}/#clinic`}}}/><BookingAssistant language={language}/></>;
}
