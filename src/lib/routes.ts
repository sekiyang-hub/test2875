import {treatments} from '@/content/treatments';import {articles} from '@/content/information';import {languages} from '@/content/languages';
export const routes=[...Object.keys(languages).map(code=>`/guide/${code}/`),'/','/about','/dentist','/treatments','/faq','/information','/location','/privacy',...treatments.map(t=>`/treatments/${t.slug}`),...articles.map(a=>`/information/${a.slug}`)];
