const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'foundation-donate.js'), 'utf8');
function run(campaign = '', embed = '') {
  function element() {return {hidden:false, children:[], attributes:{}, appendChild(el){this.children.push(el);}, setAttribute(key,value){this.attributes[key]=value;}};}
  const nodes = Object.fromEntries(['give','donate-zeffy-embed','donate-embed-fallback'].map(id=>[id,element()]));
  nodes['donate-embed-fallback'].hidden = true;
  nodes.give.dataset = {zeffyCampaignUrl:campaign, zeffyEmbedUrl:embed};
  const document = {getElementById:id=>nodes[id],createElement:element,body:element()};
  vm.runInNewContext(code,{document,URL});
  return {nodes,document};
}
const campaign = 'https://www.zeffy.com/en-US/donation-form/34e77675-f6a7-4508-a338-ca5cfc27c2e0';
const embed = 'https://www.zeffy.com/embed/donation-form/34e77675-f6a7-4508-a338-ca5cfc27c2e0';
assert.equal(run().document.body.children.length,0);
for (const value of ['http://www.zeffy.com/example','https://www.zeffy.com.attacker.test/example','https://user:pass@www.zeffy.com/example','https://www.zeffy.com:8888/example']) {
  assert.equal(run(value,embed).document.body.children.length,0);
}
assert.equal(run(campaign,'https://www.zeffy.com/not-an-embed').document.body.children.length,0);
const active = run(campaign,embed);
assert.equal(active.document.body.children.length,1);
const script = active.document.body.children[0];
assert.equal(script.src,'https://www.zeffy.com/embed/v2/zeffy-embed.js');
assert.equal(active.nodes['donate-zeffy-embed'].attributes['data-form-url'],new URL(embed).pathname);
assert.equal(active.nodes['donate-embed-fallback'].children.length,0);
script.onerror();
assert.equal(active.nodes['donate-zeffy-embed'].hidden,true);
assert.equal(active.nodes['donate-embed-fallback'].hidden,false);
const frame = active.nodes['donate-embed-fallback'].children[0];
assert.equal(frame.src,embed);
assert.equal(frame.title,'Donate to Ninjas STEM Foundation through Zeffy');
assert.equal(frame.attributes.allow,'payment');
const html = fs.readFileSync(path.join(root,'foundation-donate.html'),'utf8');
assert.ok(html.includes('data-zeffy-campaign-url="'+campaign+'"'));
assert.ok(html.includes('data-zeffy-embed-url="'+embed+'"'));
assert.ok(html.includes('data-form-url="'+new URL(embed).pathname+'"'));
assert.match(html,new RegExp('id="donate-external" href="'+campaign+'"'));
assert.doesNotMatch(html,/Online giving is coming soon|<input\b|<form\b/);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size);
let count=0;
for(const [,url] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  if(/^(https?:|mailto:|data:)/.test(url)) continue;
  const [fileAndQuery,hash]=url.split('#');
  const file=fileAndQuery.split('?')[0];
  const target=path.join(root,file||'foundation-donate.html');
  assert.ok(fs.existsSync(target),'Missing local target: '+url);
  if(hash) assert.ok(fs.readFileSync(target,'utf8').includes('id="'+hash+'"'),'Missing anchor: '+url);
  count++;
}
for(const file of ['ninjasstemfoundation.html','foundation-get-involved.html']) {
  assert.ok(fs.readFileSync(path.join(root,file),'utf8').includes('href="foundation-donate.html"'));
}
console.log(`PASS: embed setup, invalid URL rejection, script-failure fallback, campaign consistency, unique IDs, ${count} local targets, and site entry links. No network calls or payments made.`);
