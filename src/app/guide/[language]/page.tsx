import Link from 'next/link';
import { notFound } from 'next/navigation';
import { clinic, siteURL } from '@/config/clinic';
import { languages, type Language } from '@/content/languages';
import { metadata } from '@/lib/seo';

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(languages).map(language => ({ language })); }
async function getLanguage(params: Promise<{ language: string }>) {
  const { language } = await params;
  if (!Object.hasOwn(languages, language)) notFound();
  return { language: language as Language, text: languages[language as Language] };
}
export async function generateMetadata({ params }: { params: Promise<{ language: string }> }) {
  const { language, text } = await getLanguage(params);
  const result = metadata(text.title, text.intro, `/guide/${language}/`);
  return { ...result, alternates: { canonical: `${siteURL}/guide/${language}/`, languages: { ko: `${siteURL}/`, ...Object.fromEntries(Object.entries(languages).map(([code, entry]) => [entry.lang, `${siteURL}/guide/${code}/`])) } }, openGraph: { ...result.openGraph, locale: { en: 'en_US', zh: 'zh_CN', vi: 'vi_VN', mn: 'mn_MN', ne: 'ne_NP', ru: 'ru_RU', uz: 'uz_UZ', th: 'th_TH' }[language] } };
}
export default async function Guide({ params }: { params: Promise<{ language: string }> }) {
  const { text } = await getLanguage(params);
  return <article className="container language-guide content" lang={text.lang}>
    <div className="page-intro"><h1>{text.title}</h1><p lang="ko">{clinic.name}</p><p>{text.intro}</p>
      <div className="actions"><a className="button" href={`tel:${clinic.phone}`}>{text.call} · {clinic.phone}</a><a className="button secondary" href="#guide-location">{text.directions}</a></div>
    </div>
    <section id="guide-hours" className="panel"><h2>{text.hours}</h2><div className="hours-list"><div><span>{text.weekdays}</span><strong>{clinic.hours[0].open}–{clinic.hours[0].close}</strong></div><div><span>{text.weekends}</span><strong>{clinic.hours[1].open}–{clinic.hours[1].close}</strong></div></div></section>
    <section id="guide-location" className="panel"><h2>{text.location}</h2><p>{text.address}</p><p>{text.note}</p><a className="button secondary" href={clinic.naverMapURL}>{text.station}</a></section>
    <section id="guide-before" className="panel"><h2>{text.appointment}</h2><p>{text.booking}</p><p>{text.doctor}</p><a className="button" href={`tel:${clinic.phone}`}>{text.call}</a></section>
    <Link className="text-link" href="/">{text.home}</Link>
  </article>;
}
