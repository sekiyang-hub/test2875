import Link from 'next/link';
import {treatments,treatmentGroups} from '@/content/treatments';
import {translatedTreatmentHref} from '@/content/treatment-translations';
import {medicalUI} from '@/content/treatment-translations/ui';
import {treatmentLanguages,treatmentSlugs} from '@/content/treatment-languages';
import type {Language} from '@/content/languages';
export function TranslatedTreatments({language}:{language:Language}) {
 const text=treatmentLanguages[language];
 return <section id="guide-treatments"><h2>{text.menu}</h2><p>{text.intro}</p><p className="notice">{medicalUI[language].notice}</p>{treatmentGroups.map((group,i)=><section key={group}><h3>{text.groups[i]}</h3><p>{text.summaries[i]}</p><div className="content-grid">{treatments.filter(t=>t.group===group).map(t=><Link key={t.slug} className="article-card" href={translatedTreatmentHref(language,t.slug)}><strong>{text.titles[treatmentSlugs.indexOf(t.slug as typeof treatmentSlugs[number])]}</strong><span style={{display:'block',marginTop:12}}>{medicalUI[language].detail} →</span></Link>)}</div></section>)}</section>;
}
