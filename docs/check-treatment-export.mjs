import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const out=path.resolve('out');
const guide=fs.readFileSync('src/content/treatment-guides.ts','utf8');
const slugs=[...guide.matchAll(/slug:'([^']+)'/g)].map(m=>m[1]);
assert.equal(new Set(slugs).size,slugs.length,'duplicate treatment slug');
const pages=['/', '/treatments/',...slugs.map(s=>`/treatments/${s}/`)];
const htmlFor=url=>path.join(out,url.replace(/^\//,''),'index.html');
const errors=[];
for(const url of pages){
  const html=fs.readFileSync(htmlFor(url),'utf8');
  if((html.match(/<h1(?:\s|>)/g)||[]).length!==1)errors.push(`${url}: H1 count`);
  if(!/<title>[^<]+<\/title>/.test(html))errors.push(`${url}: title`);
  if(!/<meta name="description" content="[^"]+"/.test(html))errors.push(`${url}: description`);
  if(!/<link rel="canonical" href="[^"]+"/.test(html))errors.push(`${url}: canonical`);
  for(const m of html.matchAll(/<a\b[^>]*href="([^"<>]+)"/g)){
    const href=m[1].replaceAll('&amp;','&');
    if(!href.startsWith('/')&&!href.startsWith('#'))continue;
    if(href.startsWith('//'))continue;
    const dest=new URL(href,`https://clinic.test${url}`);
    const target=htmlFor(dest.pathname);
    if(!fs.existsSync(target)){errors.push(`${url}: broken link ${href}`);continue;}
    if(dest.hash){const targetHtml=dest.pathname===url?html:fs.readFileSync(target,'utf8');const id=decodeURIComponent(dest.hash.slice(1));if(!targetHtml.includes(`id="${id}"`))errors.push(`${url}: missing anchor ${href}`);}
  }
  for(const m of html.matchAll(/<img\b[^>]*>/g)){
    const tag=m[0];if(!/alt="[^"]*"/.test(tag))errors.push(`${url}: missing alt`);
    const src=tag.match(/src="([^"]+)"/)?.[1];if(src?.startsWith('/')&&!fs.existsSync(path.join(out,src)))errors.push(`${url}: broken image ${src}`);
  }
  for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){try{JSON.parse(m[1]);}catch{errors.push(`${url}: invalid JSON-LD`);}}
  if(url.startsWith('/treatments/')&&url!=='/treatments/'&&!html.includes('MedicalWebPage'))errors.push(`${url}: missing MedicalWebPage`);
}
const sitemap=fs.readFileSync(path.join(out,'sitemap.xml'),'utf8');
for(const s of slugs)if(!sitemap.includes(`/treatments/${s}`))errors.push(`sitemap: ${s}`);
const home=fs.readFileSync(htmlFor('/'),'utf8');
assert(!home.includes('faq-section'),'homepage FAQ reintroduced');
assert(!/<a[^>]+href="\/faq\/?"/.test(home),'homepage FAQ link reintroduced');
assert.equal(errors.length,0,errors.join('\n'));
console.log(`PASS: ${slugs.length} treatment pages; ${pages.length} pages checked for internal links, anchors, metadata, H1, images, JSON-LD and sitemap.`);
fs.writeFileSync('docs/export-check-result.txt',`PASS: ${slugs.length} treatment pages, ${pages.length} pages checked.\nInternal links and anchors, H1, title, description, canonical, image alt/files, JSON-LD parsing and treatment sitemap entries passed.\n`);
