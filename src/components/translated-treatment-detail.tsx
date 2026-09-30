import Link from 'next/link';
import {clinic,siteURL} from '@/config/clinic';
import {languages,type Language} from '@/content/languages';
import {treatmentLanguages} from '@/content/treatment-languages';
import {translatedTreatment,translatedTreatmentHref} from '@/content/treatment-translations';
import {medicalUI} from '@/content/treatment-translations/ui';
import {sources,type Treatment} from '@/content/treatments';
import {JsonLd} from './structured-data';
import {TreatmentFlow,ImplantDiagram,BridgeDiagram} from './treatment-content';

export function TranslatedTreatmentDetail({language,t}:{language:Language;t:Treatment}){
 const ui=medicalUI[language],visit=languages[language],guide=treatmentLanguages[language];
 const path=translatedTreatmentHref(language,t.slug),url=new URL(path,siteURL).toString();
 return <article className="container content treatment-detail language-guide" lang={visit.lang}>
  <nav className="breadcrumb" aria-label={ui.home}><Link href={`/guide/${language}/`}>{ui.home}</Link><span>/</span><Link href={`/guide/${language}/#guide-treatments`}>{guide.menu}</Link><span>/</span><span aria-current="page">{t.title}</span></nav>
  <JsonLd data={{'@context':'https://schema.org','@type':'MedicalWebPage','@id':`${url}#page`,url,name:t.title,description:t.description,inLanguage:visit.lang,about:{'@type':'Thing',name:t.title},isPartOf:{'@type':'WebSite',url:siteURL},specialty:'https://schema.org/Dentistry'}}/>
  <JsonLd data={{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{name:ui.home,path:`/guide/${language}/`},{name:guide.menu,path:`/guide/${language}/#guide-treatments`},{name:t.title,path}].map((item,i)=>({'@type':'ListItem',position:i+1,name:item.name,item:new URL(item.path,siteURL).toString()}))}}/>
  <header className="page-intro"><p className="eyebrow">{t.group}</p><h1>{t.title}</h1></header>
  <p className="notice">{ui.notice}</p>
  <nav className="treatment-toc" aria-label={guide.menu}><a href="#overview">{ui.overview}</a><a href="#examination">{ui.examination}</a><a href="#process">{ui.process}</a>{t.sections.map(s=><a key={s.id} href={`#${s.id}`}>{s.title}</a>)}<a href="#care">{ui.care}</a></nav>
  <section id="overview"><h2>{ui.overview}</h2><p>{t.definition}</p>{t.diagram==='implant'&&<ImplantDiagram labels={ui.implant}/>} {t.diagram==='bridge'&&<BridgeDiagram labels={ui.bridge}/>}</section>
  <section id="examination"><h2>{ui.examination}</h2><p>{t.examination}</p></section>
  <section id="process"><h2>{ui.process}</h2><TreatmentFlow steps={t.steps} label={ui.process}/><p className="muted">{ui.flowNote}</p></section>
  {t.sections.map(s=><section id={s.id} key={s.id}><h2>{s.title}</h2><p>{s.text}</p>{s.items&&<ul>{s.items.map(item=><li key={item}>{item}</li>)}</ul>}</section>)}
  <section id="care"><h2>{ui.care}</h2><p>{t.care}</p><h3>{ui.caution}</h3><p>{t.caution}</p></section>
  <section><h2>{ui.related}</h2><div className="related-treatments">{t.related.map(slug=>{const related=translatedTreatment(language,slug);return related&&<Link key={slug} href={translatedTreatmentHref(language,slug)}>{related.title} →</Link>;})}</div></section>
  <section className="source-links"><h2>{ui.sources}</h2><p>{ui.sourceNote}</p><ul>{t.sourceKeys.map(key=><li key={key}><a href={sources[key].url} target="_blank" rel="noopener noreferrer" lang={key==='stm'?'ko':'en'}>{key==='stm'?'STM · Zirconia laboratory study':sources[key].name}</a></li>)}</ul></section>
  <section><h2>{ui.contact}</h2><div className="actions"><Link className="button" href={`/guide/${language}/#guide-treatments`}>{guide.menu}</Link><a className="button secondary" href={`tel:${clinic.phone}`}>{visit.call}</a><Link className="button secondary" href={`/guide/${language}/#guide-location`}>{visit.directions}</Link>{clinic.reservationURL&&<a className="button naver" href={clinic.reservationURL} target="_blank" rel="noopener noreferrer">{ui.booking}</a>}{clinic.kakaoURL&&<a className="button kakao" href={clinic.kakaoURL}>{ui.kakao}</a>}</div></section>
 </article>;
}
