import Link from 'next/link';
import { treatments, treatmentGroups, treatmentHref } from '@/content/treatments';
import { Breadcrumb, PageIntro, Notice } from './clinic-ui';
import { BreadcrumbSchema } from './structured-data';
import { SymptomFinder } from './treatment-content';
import { metadata } from '@/lib/seo';
export const generateMetadata=()=>metadata('진료 안내 · 증상별 치료 찾기','임플란트 식립과 수리, 충치·생활치수치료·근관치료, 잇몸, 보철·심미, 사랑니, 턱관절과 교정 안내. 증상에서 관련 치료정보를 찾아보세요.','/treatments/');
export default function TreatmentIndex() {
  return <div className="container content"><Breadcrumb title="진료 안내"/><BreadcrumbSchema title="진료 안내" path="/treatments/"/><PageIntro eyebrow="DENTAL CARE" title="진료 안내" description="증상과 치료 분야에서 필요한 정보를 찾아보세요."/>
    <Notice>검사와 진단에 따라 치료방법이 달라집니다. 안내된 치료의 실제 본원 제공 범위는 진료 시 확인합니다.</Notice>
    <nav className="treatment-categories" aria-label="진료 분야 바로가기">{treatmentGroups.map((group,i)=><a key={group} href={`#group-${i}`}>{group}</a>)}</nav>
    <div id="symptoms"><SymptomFinder/></div>
    {treatmentGroups.map((group,i)=><section id={`group-${i}`} className="treatment-group" key={group}><h2>{group}</h2><div className="content-grid">{treatments.filter(t=>t.group===group).map(t=><Link href={treatmentHref(t.slug)} className="article-card" key={t.slug}><h3>{t.title}</h3><p>{t.description}</p><span>안내 보기 →</span></Link>)}</div></section>)}
  </div>;
}
export function HomeTreatmentOverview() {
  const entries=['implant','cavity','periodontal','prosthodontics','wisdom-teeth','diastema'];
  return <section className="section container"><div className="section-heading"><div><span className="eyebrow">DENTAL CARE</span><h2>진료 안내</h2></div><Link href="/treatments/">전체 진료 안내 →</Link></div><p>치아와 잇몸의 상태를 확인하고, 보존 가능성과 치료 선택지를 함께 살펴봅니다.</p><div className="home-treatment-grid">{entries.map(slug=>{const t=treatments.find(x=>x.slug===slug)!;return <Link className="article-card" key={slug} href={`/treatments/#group-${treatmentGroups.indexOf(t.group)}`}><h3>{t.group}</h3><p>{t.description}</p><span>진료 정보 보기 →</span></Link>;})}</div><div className="home-symptoms"><SymptomFinder compact/></div></section>;
}
