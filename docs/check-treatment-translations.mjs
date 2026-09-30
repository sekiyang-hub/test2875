import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import assert from 'node:assert/strict';
const root=process.cwd();
function readData(file,name){const source=fs.readFileSync(file,'utf8');const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const exports={};new Function('exports',js)(exports);return exports[name];}
const original=readData('src/content/treatment-guides.ts','treatments');
const codes=['en','zh','vi','mn','ne','ru','uz','th'];
let count=0;
for(const code of codes){
 const data=readData(`src/content/treatment-translations/${code}.ts`,code);
 assert.equal(Object.keys(data).length,22,`${code}: translation count`);
 const guide=fs.readFileSync(`out/guide/${code}/index.html`,'utf8');
 for(const t of original){
  const translated=data[t.slug];assert.ok(translated,`${code}/${t.slug}`);
  assert.equal(translated.sections.length,t.sections.length,`${code}/${t.slug}: sections`);
  assert.equal(translated.steps.length,t.steps.length,`${code}/${t.slug}: steps`);
  t.sections.forEach((s,i)=>assert.equal(translated.sections[i].items?.length,s.items?.length,`${code}/${t.slug}: items`));
  for(const key of ['definition','examination','care','caution'])assert.ok(translated[key]?.trim(),`${code}/${t.slug}/${key}`);
  assert.ok(!/[가-힣]/.test(JSON.stringify(translated)),`${code}/${t.slug}: untranslated Korean`);
  const route=`/guide/${code}/treatments/${t.slug}/`;
  assert.ok(guide.includes(`href="${route}"`),`${code}: guide link`);
  const html=fs.readFileSync(`out${route}index.html`,'utf8');
  assert.equal((html.match(/<h1(?:\s[^>]*)?>/g)||[]).length,1,`${route}: H1`);
  assert.ok(html.includes(`href="https://www.dental365.net${route}"`),`${route}: canonical`);
  assert.ok(html.includes('name="description"'),`${route}: description`);
  assert.equal((html.match(/rel="alternate" hrefLang=/g)||[]).length,9,`${route}: hreflang`);
  const body=html.match(/<article\b[\s\S]*?<\/article>/)?.[0];assert.ok(body,`${route}: article`);
  assert.ok(!/[가-힣]/.test(body),`${route}: Korean in article`);
  for(const s of t.sections)assert.ok(body.includes(`id="${s.id}"`),`${route}: section ${s.id}`);
  for(const key of ['overview','examination','process','care'])assert.ok(body.includes(`id="${key}"`),`${route}: section ${key}`);
  for(const match of body.matchAll(/href="([^"#]+)(#[^"]+)?"/g)){
   if(!match[1].startsWith('/'))continue;
   const file=path.join(root,'out',match[1], 'index.html');assert.ok(fs.existsSync(file),`${route}: broken link ${match[1]}`);
   if(match[2])assert.ok(fs.readFileSync(file,'utf8').includes(`id="${match[2].slice(1)}"`),`${route}: broken anchor ${match[0]}`);
  }
  const schema=Array.from(html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)).map(m=>JSON.parse(m[1]));
  const page=schema.find(s=>s['@type']==='MedicalWebPage');assert.equal(page.url,`https://www.dental365.net${route}`);
  assert.ok(fs.readFileSync('out/sitemap.xml','utf8').includes(`https://www.dental365.net${route}`),`${route}: sitemap`);
  count++;
 }
}
console.log(`PASS: ${count} translated detail pages; 8 guide pages; all source sections, items and steps; no Korean in translated articles; metadata, hreflang, schema, sitemap, links and anchors.`);
