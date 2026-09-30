import {notFound} from "next/navigation";
import {treatments} from "@/content/treatments";
import {TreatmentDetail} from "@/components/treatment-detail";
import {metadata} from "@/lib/seo";
import {languages} from '@/content/languages';
import {siteURL} from '@/config/clinic';
export const dynamicParams=false;
export function generateStaticParams(){return treatments.map(t=>({slug:t.slug}));}
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){const {slug}=await params;const t=treatments.find(t=>t.slug===slug);if(!t)return {};const base=metadata(t.title,t.description,"/treatments/"+slug+"/");return {...base,alternates:{canonical:new URL(`/treatments/${slug}/`,siteURL).toString(),languages:{ko:new URL(`/treatments/${slug}/`,siteURL).toString(),...Object.fromEntries(Object.entries(languages).map(([code,text])=>[text.lang,new URL(`/guide/${code}/treatments/${slug}/`,siteURL).toString()]))}}};}
export default async function Page({params}:Props){const {slug}=await params;const t=treatments.find(t=>t.slug===slug);if(!t)notFound();return <TreatmentDetail t={t}/>;}
