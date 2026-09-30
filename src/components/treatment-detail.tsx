import Link from 'next/link';
import { treatments, sources, treatmentHref, type Treatment } from '@/content/treatments';
import { Breadcrumb, PageIntro, Notice, ContactActions } from './clinic-ui';
import { BreadcrumbSchema } from './structured-data';
import { TreatmentSchema } from './treatment-schema';
import { TreatmentFlow, ImplantDiagram, BridgeDiagram, DiastemaOptions } from './treatment-content';
export function TreatmentDetail({t}:{t:Treatment}) {
  return <div className="container content treatment-detail">
    <Breadcrumb title={t.title} parent={{name:'진료 안내',url:'/treatments'}}/>
    <BreadcrumbSchema title={t.title} path={`/treatments/${t.slug}/`} parent={{name:'진료 안내',url:'/treatments'}}/>
    <TreatmentSchema t={t}/>
    <PageIntro eyebrow={t.group} title={t.title} description={t.description}/>
    <Notice>개인의 상태에 따라 치료 가능 여부와 방법이 달라집니다. 아래는 일반적인 의료정보이며, 실제 본원 진료범위와 개인별 치료계획은 진료 시 확인합니다.</Notice>
    <nav className="treatment-toc" aria-label="이 페이지 내용"><a href="#overview">치료 이해하기</a><a href="#examination">어떤 검사를 하나요?</a><a href="#process">진료 흐름</a>{t.sections.map(s=><a key={s.id} href={`#${s.id}`}>{s.title}</a>)}<a href="#care">치료 후 관리</a></nav>
    <section id="overview"><h2>치료 이해하기</h2><p>{t.definition}</p>{t.diagram==='implant'&&<ImplantDiagram/>}{t.diagram==='bridge'&&<BridgeDiagram/>}</section>
    <section id="examination"><h2>어떤 검사를 하나요?</h2><p>{t.examination}</p></section>
    <section id="process"><h2>검사와 치료의 흐름</h2>{t.slug==='diastema'?<DiastemaOptions/>:<TreatmentFlow steps={t.steps}/>}<p className="muted">검사 결과에 따라 단계가 달라지거나 추가 처치가 필요할 수 있습니다.</p></section>
    {t.sections.map(s=><section id={s.id} key={s.id}><h2>{s.title}</h2><p>{s.text}</p>{s.items&&<ul>{s.items.map(item=><li key={item}>{item}</li>)}</ul>}</section>)}
    <section id="care"><h2>치료 후 어떻게 관리하나요?</h2><p>{t.care}</p><h3>함께 확인할 점</h3><p>{t.caution}</p></section>
    <section><h2>관련 진료 안내</h2><div className="related-treatments">{t.related.map(slug=>{const related=treatments.find(x=>x.slug===slug);return related&&<Link key={slug} href={treatmentHref(slug)}>{related.title} →</Link>;})}</div></section>
    <section className="source-links"><h2>참고 자료</h2><p>일반적인 치료 이해를 위한 자료입니다. 본원의 치료 결과를 나타내지 않습니다. 의료진 최종 검토 전 · 작성일 2026-09-30</p><ul>{t.sourceKeys.map(key=><li key={key}><a href={sources[key].url} target="_blank" rel="noopener noreferrer">{sources[key].name}</a></li>)}</ul></section>
    <section><h2>진료 상담과 방문 안내</h2><ContactActions/></section>
  </div>;
}
