import {treatments} from '@/content/treatments';import {articles} from '@/content/information';
export const routes=['/','/about','/dentist','/treatments','/faq','/information','/location','/privacy',...treatments.map(t=>`/treatments/${t.slug}`),...articles.map(a=>`/information/${a.slug}`)];
