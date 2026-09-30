import { JsonLd } from './structured-data';
import { siteURL } from '@/config/clinic';
import type { Treatment } from '@/content/treatments';
export function TreatmentSchema({t}:{t:Treatment}) {
  if(!siteURL) return null;
  const url=new URL(`/treatments/${t.slug}/`,siteURL).toString();
  return <JsonLd data={{'@context':'https://schema.org','@type':'MedicalWebPage','@id':`${url}#page`,url,name:t.title,description:t.description,inLanguage:'ko-KR',about:{'@type':'Thing',name:t.title},isPartOf:{'@type':'WebSite',url:siteURL},specialty:'https://schema.org/Dentistry'}}/>;
}
