import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const config=JSON.parse(await fs.readFile(path.join(root,'document-packages.json'),'utf8'));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const localPath=s=>typeof s==='string' && /^[a-zA-Z0-9][a-zA-Z0-9_./?#=%&-]*$/.test(s) && !s.includes('..') && !s.includes('//') && !s.includes(':');
const metadata=d=>['version','effectiveDate'].filter(k=>d[k] && d.metadataVerified===true).map(k=>'<span>'+ (k==='version'?'Version: ':'Effective date: ')+esc(d[k])+'</span>').join('');
export async function renderPackage(p){
  if(!/^[a-z0-9-]+$/.test(p.id) || !/^doc-[a-z0-9-]+$/.test(p.entryId)) throw Error('Invalid package identifier');
  const docs=await Promise.all(p.documents.map(async(d)=>{
    if(d.public!==true) throw Error('Only explicitly public documents belong in this manifest');
    let links='<span class="dp-unavailable">Not published on this site</span>';
    if(d.file){
      if(!localPath(d.file) || !/^docs\/.*\.pdf$/.test(d.file)) throw Error('Invalid public PDF path');
      const bytes=await fs.readFile(path.join(root,d.file));
      if(bytes.subarray(0,5).toString()!=='%PDF-') throw Error('Not a PDF: '+d.file);
      links='<a href="'+esc(d.file)+'" target="_blank" rel="noopener" aria-label="View '+esc(d.title)+' PDF (opens in a new tab)">View PDF <span aria-hidden="true">↗</span></a><a href="'+esc(d.file)+'" download aria-label="Download '+esc(d.title)+' PDF">Download PDF <span aria-hidden="true">↓</span></a>';
    }
    return '<li class="dp-document"><div><h5>'+esc(d.title)+'</h5><p>'+esc(d.description)+'</p>'+(metadata(d)?'<div class="dp-metadata">'+metadata(d)+'</div>':'')+'</div><div class="dp-links">'+links+'</div></li>';
  }));
  if(p.action && !localPath(p.action.href)) throw Error('Invalid contact link');
  const related=(p.related||[]).map(d=>'<li>'+(d.file && d.publishedVerified===true && localPath(d.file)?'<a href="'+esc(d.file)+'">'+esc(d.title)+'</a>':esc(d.title)+' <span>— '+esc(d.publication||'Not published on this site')+'</span>')+'</li>').join('');
  const available=p.documents.filter(d=>d.file).length;
  return '<li class="gl-package-entry" id="'+esc(p.entryId)+'"><details class="document-package" id="package-'+esc(p.id)+'"><summary><div class="dp-summary-copy"><span class="dp-eyebrow">Document package</span><h4>'+esc(p.title)+'</h4><span class="dp-summary-status">'+available+' public PDF'+(available===1?'':'s')+' · Adoption: '+esc(p.adoption||'Not verified')+'</span></div><span class="dp-chevron" aria-hidden="true"></span></summary><div class="dp-body"><p class="dp-description">'+esc(p.description)+'</p><dl class="dp-status"><div><dt>Adoption</dt><dd>'+esc(p.adoption||'Not verified')+'</dd></div><div><dt>Publication</dt><dd>'+available+' of '+p.documents.length+' documents available</dd></div></dl>'+(p.note?'<p class="dp-note">'+esc(p.note)+'</p>':'')+'<ul class="dp-document-list">'+docs.join('')+'</ul>'+(related?'<div class="dp-related"><h5>Related safety policies</h5><p>Listed under Student Participation &amp; Youth Safety. Document links become available once published.</p><ul>'+related+'</ul></div>':'')+(p.action?'<a class="dp-action" href="'+esc(p.action.href)+'">'+esc(p.action.title)+' <span aria-hidden="true">→</span></a>':'')+'</div></details></li>';
}
let html=await fs.readFile(path.join(root,'foundation-governance.html'),'utf8');
for(const p of config.packages){
  const marker='<!-- document-package:'+p.id+' -->';
  const end='<!-- /document-package:'+p.id+' -->';
  const rendered=marker+'\n'+await renderPackage(p)+'\n'+end;
  if(html.includes(marker)){
    const start=html.indexOf(marker),finish=html.indexOf(end,start);
    if(finish<0) throw Error('Missing package end marker');
    html=html.slice(0,start)+rendered+html.slice(finish+end.length);
  }else{
    const escaped=p.entryId.replace(/[.*+?^$()|[\]\\]/g,'\\$&');
    const pattern=new RegExp('<li class="gl-document" id="'+escaped+'">[\\s\\S]*?<\\/li>');
    if(!pattern.test(html)) throw Error('Missing governance entry '+p.entryId);
    html=html.replace(pattern,rendered);
  }
}
await fs.writeFile(path.join(root,'foundation-governance.html'),html);
console.log('Rendered '+config.packages.length+' document package(s).');
