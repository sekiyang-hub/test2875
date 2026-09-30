import {notFound} from 'next/navigation';
import {languages,type Language} from '@/content/languages';
import {treatments} from '@/content/treatments';
import {translatedTreatment,translatedTreatmentHref} from '@/content/treatment-translations';
import {TranslatedTreatmentDetail} from '@/components/translated-treatment-detail';
import {siteURL} from '@/config/clinic';
import {metadata} from '@/lib/seo';
export const dynamicParams=false;
export function generateStaticParams(){return Object.keys(languages).flatMap(language=>treatments.map(t=>({language,slug:t.slug})));}
async function getTreatment(params:Promise<{language:string;slug:string}>){
 const {language,slug}=await params;
 if(!Object.hasOwn(languages,language))notFound();
 const code=language as Language,t=translatedTreatment(code,slug);
 if(!t)notFound();
 return {language:code,t};
}
export async function generateMetadata({params}:{params:Promise<{language:string;slug:string}>}){
 const {language,t}=await getTreatment(params),path=translatedTreatmentHref(language,t.slug);
 const base=metadata(t.title,t.description,path);
 return {...base,alternates:{canonical:new URL(path,siteURL).toString(),languages:{ko:new URL(`/treatments/${t.slug}/`,siteURL).toString(),...Object.fromEntries(Object.entries(languages).map(([code,text])=>[text.lang,new URL(translatedTreatmentHref(code as Language,t.slug),siteURL).toString()]))}},openGraph:{...base.openGraph,locale:{en:'en_US',zh:'zh_CN',vi:'vi_VN',mn:'mn_MN',ne:'ne_NP',ru:'ru_RU',uz:'uz_UZ',th:'th_TH'}[language]}};
}
export default async function Page({params}:{params:Promise<{language:string;slug:string}>}){
 const {language,t}=await getTreatment(params);
 return <TranslatedTreatmentDetail language={language} t={t}/>;
}
