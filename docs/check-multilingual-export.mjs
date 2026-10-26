// Run after next build: node docs/check-multilingual-export.mjs [export-directory]
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {bookingLanguages} from '../src/content/booking-languages.ts';
const output=new URL(`${process.argv[2]||'out'}/`,new URL('../',import.meta.url));
const sitemap=await readFile(new URL('sitemap.xml',output),'utf8');
let checks=0;
for(const [code,t] of Object.entries(bookingLanguages)){
 if(code==='ko')continue;
 const page=await readFile(new URL(`guide/${code}/booking/index.html`,output),'utf8');
 assert.ok(page.includes(t.title),`${code} title`);assert.ok(page.includes(t.start),`${code} start`);
 assert.ok(page.includes(t.shortTitle),`${code} launcher`);assert.ok(page.includes(`lang="${t.lang}"`),`${code} language`);
 assert.ok(page.includes(`"inLanguage":"${t.lang}"`),`${code} structured data`);
 assert.ok(sitemap.includes(`/guide/${code}/booking/`),`${code} sitemap`);
 for(const other of Object.keys(bookingLanguages))if(other!=='ko')assert.ok(page.includes(`/guide/${other}/booking/`),`${code} booking language switch ${other}`);
 const home=await readFile(new URL(`guide/${code}/index.html`,output),'utf8');
 assert.ok(home.includes(`/guide/${code}/booking/`),`${code} guide booking link`);
 const treatment=await readFile(new URL(`guide/${code}/treatments/implant/index.html`,output),'utf8');
 assert.ok(treatment.includes(t.shortTitle),`${code} treatment launcher`);checks+=16;
}
console.log(`PASS: ${checks} multilingual exported page/link/launcher/schema/sitemap checks`);
