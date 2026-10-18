// Keep existing shared notebook links working after the move.
(()=>{const anchors=['#makers-notebook','#notebook-revolver','#notebook-pin-catcher','#notebook-power-sharing'];const follow=()=>{if(anchors.includes(location.hash))location.replace('foundation-notebook.html'+location.hash);};window.addEventListener('hashchange',follow);follow();})();

(function(){
 const root=document.getElementById('makers-notebook-stories'),site=root.querySelector('.mk-site');
 const logo='nsf-logo-hd.webp';
 root.querySelectorAll('[data-mk-logo]').forEach(function(img){img.src=logo;});
 const paths={
  learn:{label:'For students & families',title:'Find your place on a team.',copy:'Build, code, test, document the engineering process, or lead outreach. Every contribution helps the team learn.',accent:'#176cff',href:'foundation-programs.html#programs',link:'See programs →'},
  host:{label:'For schools & libraries',title:'Bring the next discovery to your community.',copy:'Explore hands-on robot demonstrations and workshops adapted to your school, library, or family event.',accent:'#e82d41',href:'foundation-programs.html#robotics-discovery',link:'Explore workshops →'},
  share:{label:'For mentors & supporters',title:'Your experience can spark someone else’s idea.',copy:'Volunteer, support learning resources, or help developing teams strengthen their own engineering and teamwork.',accent:'#176cff',href:'foundation-get-involved.html#involve',link:'Ways to get involved →'}
 };

 const state={motion:true,depth:7};
 const cards=Array.from(root.querySelectorAll('.mk-card'));

 const reduced=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)').matches:false;
 function play(card){
  card.classList.remove('is-playing');void card.offsetWidth;
  if(state.motion&&!reduced)card.classList.add('is-playing');
 }
 function selectPath(key,animate){
  const value=paths[key];if(!value)return;
  cards.forEach(function(card){const active=card.getAttribute('data-path')===key;card.classList.toggle('is-active',active);card.querySelector('.mk-select').setAttribute('aria-pressed',String(active));if(!active)card.classList.remove('is-playing');if(active&&animate)play(card);});
  site.style.setProperty('--mk-accent',value.accent);
  root.querySelector('[data-preview-label]').textContent=value.label;
  root.querySelector('[data-preview-title]').textContent=value.title;
  root.querySelector('[data-preview-copy]').textContent=value.copy;
  const link=root.querySelector('[data-preview-link]');link.href=value.href;link.textContent=value.link;
 }

 cards.forEach(function(card){
  const button=card.querySelector('.mk-select'),key=card.getAttribute('data-path');
  card.addEventListener('pointerenter',function(event){if(event.pointerType!=='touch')selectPath(key,true);});
  button.addEventListener('focus',function(){selectPath(key,true);});
  button.addEventListener('click',function(){selectPath(key,true);});
  card.addEventListener('pointermove',function(event){
   if(!state.motion||reduced||event.pointerType==='touch')return;
   const rect=card.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;
   card.style.setProperty('--mk-rx',(-y*state.depth).toFixed(2)+'deg');card.style.setProperty('--mk-ry',(x*state.depth).toFixed(2)+'deg');
  });
  card.addEventListener('pointerleave',function(){card.style.setProperty('--mk-rx','0deg');card.style.setProperty('--mk-ry','0deg');card.classList.remove('is-playing');});
 });
 function render(){site.classList.toggle('mk-calm',!state.motion);site.style.setProperty('--mk-depth',state.depth);site.style.setProperty('--mk-strength',state.depth/7);if(!state.motion)cards.forEach(function(card){card.style.setProperty('--mk-rx','0deg');card.style.setProperty('--mk-ry','0deg');});}
 render();selectPath('learn',false);
 const motionButton=root.querySelector('.mk-motion-toggle');
 function syncMotion(){motionButton.disabled=reduced;motionButton.setAttribute('aria-pressed',String(!state.motion));motionButton.textContent=reduced?'Reduced motion enabled':state.motion?'Pause motion':'Enable motion';render();root.dispatchEvent(new Event('nsf:motionchange'));}
 motionButton.addEventListener('click',()=>{state.motion=!state.motion;syncMotion();});
 if(reduced){state.motion=false;syncMotion();}
})();


(()=>{
 const r=document.getElementById('makers-notebook-stories');

 const q=s=>r.querySelector(s),qa=s=>Array.from(r.querySelectorAll(s));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const active=()=>!reduced.matches&&!q('.mk-site').classList.contains('mk-calm');
 const animate=(el,frames,options)=>{if(active()&&el.animate)el.animate(frames,options)};
 q('.mk-hero').addEventListener('pointermove',e=>{if(!active()||e.pointerType==='touch')return;const b=q('.mk-hero').getBoundingClientRect();q('.mk-hero').style.setProperty('--spot-x',((e.clientX-b.left)/b.width*100)+'%');q('.mk-hero').style.setProperty('--spot-y',((e.clientY-b.top)/b.height*100)+'%')});
 if(globalThis.IntersectionObserver){const ob=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){animate(e.target,[{transform:'translateY(35px) rotate(-1deg)',opacity:.5},{transform:'none',opacity:1}],{duration:850,easing:'ease-out'});ob.unobserve(e.target)}}),{threshold:.12});qa('.mk-community,.mk-support').forEach(el=>ob.observe(el));}
 if(globalThis.lucide)lucide.createIcons();
 const stopAnimations=()=>r.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
 r.addEventListener('nsf:motionchange',()=>{if(!active())stopAnimations();});
 reduced.addEventListener('change',()=>{if(reduced.matches)stopAnimations();});
})();
