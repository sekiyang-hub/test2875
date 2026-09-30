import Link from 'next/link';
import {treatments,treatmentGroups,treatmentHref} from '@/content/treatments';
import {treatmentLanguages,treatmentSlugs} from '@/content/treatment-languages';
import type {Language} from '@/content/languages';
export function TranslatedTreatments({language}:{language:Language}) {
 const text=treatmentLanguages[language];
 return <section id="guide-treatments"><h2>{text.menu}</h2><p>{text.intro}</p><p className="notice">{text.note}</p>{treatmentGroups.map((group,i)=><section key={group}><h3>{text.groups[i]}</h3><p>{text.summaries[i]}</p><div className="content-grid">{treatments.filter(t=>t.group===group).map(t=><Link key={t.slug} className="article-card" href={treatmentHref(t.slug)}><strong>{text.titles[treatmentSlugs.indexOf(t.slug as typeof treatmentSlugs[number])]}</strong><span style={{display:'block',marginTop:12}}>{text.detail} →</span></Link>)}</div></section>)}</section>;
}
