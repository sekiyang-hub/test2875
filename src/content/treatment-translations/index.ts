import {en} from './en';
import {zh} from './zh';
import {vi} from './vi';
import {mn} from './mn';
import {ne} from './ne';
import {ru} from './ru';
import {uz} from './uz';
import {th} from './th';
import {treatments,treatmentGroups,type Treatment} from '../treatments';
import {treatmentLanguages,treatmentSlugs} from '../treatment-languages';
import type {Language} from '../languages';
import type {MedicalTranslations} from './types';

export const medicalTranslations:Record<Language,MedicalTranslations>={en,zh,vi,mn,ne,ru,uz,th};
export function translatedTreatment(language:Language,slug:string):Treatment|undefined {
 const original=treatments.find(t=>t.slug===slug);
 const translation=medicalTranslations[language][slug];
 if(!original||!translation)return undefined;
 const text=treatmentLanguages[language];
 return {...original,...translation,title:text.titles[treatmentSlugs.indexOf(slug as typeof treatmentSlugs[number])],group:text.groups[treatmentGroups.indexOf(original.group)],description:translation.definition,sections:translation.sections.map((section,i)=>({...section,id:original.sections[i].id}))};
}
export const translatedTreatmentHref=(language:Language,slug:string)=>{
 const [page,hash]=slug.split('#');
 return `/guide/${language}/treatments/${page}/${hash?`#${hash}`:''}`;
};
