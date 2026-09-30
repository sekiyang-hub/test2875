import {notFound} from "next/navigation";
import {treatments} from "@/content/treatments";
import {TreatmentDetail} from "@/components/treatment-detail";
import {metadata} from "@/lib/seo";
export const dynamicParams=false;
export function generateStaticParams(){return treatments.map(t=>({slug:t.slug}));}
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){const {slug}=await params;const t=treatments.find(t=>t.slug===slug);return t?metadata(t.title,t.description,"/treatments/"+slug+"/"):{};}
export default async function Page({params}:Props){const {slug}=await params;const t=treatments.find(t=>t.slug===slug);if(!t)notFound();return <TreatmentDetail t={t}/>;}
