
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
 if(globalThis.IntersectionObserver){const ob=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){animate(e.target,[{transform:'translateY(35px) rotate(-1deg)',opacity:.5},{transform:'none',opacity:1}],{duration:850,easing:'ease-out'});ob.unobserve(e.target)}}),{threshold:.12});qa('.mk-process,.mk-support').forEach(el=>ob.observe(el));}
 if(globalThis.lucide)lucide.createIcons();
 const stopAnimations=()=>r.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
 r.addEventListener('nsf:motionchange',()=>{if(!active())stopAnimations();});
 reduced.addEventListener('change',()=>{if(reduced.matches)stopAnimations();});
})();


(()=>{
const root=document.getElementById('makers-notebook-stories'),q=s=>root.querySelector(s),qa=s=>Array.from(root.querySelectorAll(s));
const stories={"revolver":{"title":"A smoother spin","season":"2025–2026 · Mix & Match","intro":"How the team followed a snag from the revolver’s base to the small details underneath each stack.","steps":[{"label":"Notice the snag","image":"slide-56","slide":56,"title":"What was catching?","copy":"The revolver needed to carry pin stacks to its unloading opening. An uneven base created bumps and friction along the way.","lesson":"Could a smoother surface help the stacks move?","tag":"Observe","caption":"Original team diagram · Revolver, notebook page 17","alt":"Team diagram of the uneven revolver base and its unloading opening."},{"label":"Smooth the base","image":"slide-57","slide":57,"title":"A smoother surface revealed a smaller snag.","copy":"Three plastic sheets covered the base. The surface improved, but the fasteners holding the sheets down could still catch the bottoms of the pins.","lesson":"Test the contact points, including the parts that hold a solution together.","tag":"First experiment","caption":"Original team diagram · Revolver, notebook page 18","alt":"Team diagram showing a game pin catching on a fastener above the plastic sheet."},{"label":"Support the stack","image":"slide-58","slide":58,"title":"Let each stack ride on a door.","copy":"The team added a support door to each revolver slot, lifting the pins off the base. Under load, those doors could still catch on uneven surfaces.","lesson":"An unloaded mechanism can behave differently when it carries a stack.","tag":"Redesign","caption":"Original team photographs · Revolver, notebook page 19","alt":"Notebook photos of grooves beneath a game pin and the new supporting door."},{"label":"Add a small slope","image":"slide-60","slide":60,"title":"A small slope made the difference.","copy":"Corner connectors filled gaps in the base. Sloped pieces beneath the doors helped them travel over the remaining uneven areas. The team reported a smoother spin.","lesson":"Look closely at the exact place where two parts meet.","tag":"Recorded improvement","caption":"Original team photographs · Revolver, notebook page 21","alt":"Notebook photos showing corner connectors and sloped pieces underneath the revolver doors."}]},"pin":{"title":"Catch the pin","season":"2025–2026 · Mix & Match","intro":"From bending belts and tilted pins to a pneumatic catcher that holds a pin long enough for the conveyor to take it in.","steps":[{"label":"Find the belt problem","image":"pin-23","slide":23,"title":"A tilted pin misses its slot.","copy":"Pins sometimes jammed or flew out instead of entering the revolver. The team noticed that the conveyor belts bent around a pin, letting it lean away from the narrow opening.","lesson":"The problem began inside the conveyor, before the pin reached the revolver.","tag":"Observe","caption":"Original team diagram · Intake, notebook page 4","alt":"Team comparison of a straight conveyor holding an upright pin and a deformed conveyor allowing the pin to tilt."},{"label":"Guide it upright","image":"pin-26","slide":26,"title":"Guide the pin without squeezing it.","copy":"Side supports and extra traction pads did not solve everything. The team added top and bottom guides, then widened the top spacing when a tighter fit demanded too much motor power.","lesson":"Good alignment still needs enough clearance for the pin to move freely.","tag":"Balance the tradeoff","caption":"Original team diagrams · Intake, notebook page 7","alt":"Side and top views of the team’s conveyor guides, with the bottom and top aligners labeled."},{"label":"Synchronize the belts","image":"pin-28","slide":28,"title":"Two motors needed one rhythm.","copy":"Independent motors did not start and stop together. An early coupling broke gears and twisted a plastic axle. A simpler four-gear connection synchronized the two belt halves.","lesson":"In 150 recorded intake trials, the team counted seven serious errors. A useful improvement—and still a reason to keep testing.","tag":"Test and simplify","caption":"Original gearbox photograph · Intake, notebook page 9","alt":"The team’s conveyor with an arrow identifying the four-gear mechanism coupling the two belt halves."},{"label":"Try it while driving","image":"pin-33","slide":33,"title":"Hand-feeding worked. Driving changed the test.","copy":"On the field, the approaching robot could push a pin away before the belts grabbed it. Slowing the robot and keeping traction pads clear of the entrance did not fully solve that problem.","lesson":"The new idea: trap the pin at the entrance so the conveyor has time to take it in.","tag":"A new failure appears","caption":"Original “Trapped!” sketch · Intake, notebook page 14","alt":"Team sketch showing a swinging catcher confining a red pin against the conveyor entrance."},{"label":"Build the air-powered trap","image":"pin-34","slide":34,"title":"A compact arm closes around the pin.","copy":"Pneumatics—compressed air moving a cylinder—powered a four-bar linkage. A shorter front link made the catcher swing farther inward, holding the pin in a small space at the conveyor entrance.","lesson":"The arm keeps the pin from escaping while the belts do the lifting.","tag":"Build the mechanism","caption":"Original open and closed photographs · Intake, notebook page 15","alt":"Original photos of a red pin held by the pneumatic catcher and the same mechanism open, ready for another pin."},{"label":"Sense, catch, reset","image":"pin-35","slide":35,"title":"Let the pin trigger the sequence.","copy":"A distance sensor at the entrance triggered the catcher to close. An optical/color sensor farther along the conveyor detected successful intake and reopened it for the next pin.","lesson":"Two different observations control two different actions: arriving closes the catcher; moving inside releases it.","tag":"Connect code and mechanics","caption":"Original mechanism photographs · Intake, notebook page 16","alt":"Team photographs comparing the pin pusher open and closed around a red pin."},{"label":"Refine the approach","image":"pin-37","slide":37,"title":"The entrance needed guidance, too.","copy":"Practice revealed another edge case: an off-center approach could still push a pin aside. The team added entrance guiders to funnel pins toward the conveyor.","lesson":"A working mechanism becomes more useful when it tolerates the imperfect approaches of a real match.","tag":"Return to field testing","caption":"Original entrance-guider diagram · Intake, notebook page 18","alt":"Team diagram showing angled entrance guides steering an off-center pin into the conveyor."}]},"pto":{"title":"Share the power","season":"2024–2025 · Rapid Relay","intro":"Driving, charging the cannon, and collecting balls competed for motor power. A power take-off, or PTO, redirected existing motors between jobs.","steps":[{"label":"Make the shift secure","image":"pto-195","slide":195,"title":"A gearbox must stay engaged.","copy":"Early PTO models did not hold their gears securely enough. The team compared several arrangements; moving the motor and gear together, with side supports, produced the model they recorded as secure.","lesson":"Power sharing starts with a reliable mechanical connection.","tag":"December 2024 · Compare designs","caption":"Original comparison notes · notebook page 168 / slide 195","alt":"Team notes comparing motor-and-gear movement with and without side supports; model 3.1 is recorded as secure."},{"label":"Find the overloaded pair","image":"pto-225","slide":225,"title":"Too many jobs shared the same power.","copy":"One motor pair drove the robot, another powered the conveyor, and a third could help drive or charge the cannon. The front rollers also borrowed conveyor power. During rapid loading, that extra load slowed the conveyor and could jam balls.","lesson":"Could the switchable pair help the front rollers when the cannon did not need charging?","tag":"Version 7 · Identify the bottleneck","caption":"Original design questions · slide 225","alt":"Notebook questions exploring ways to share motor power with the front extension and give the third motor pair a third function."},{"label":"Give one pair three jobs","image":"pto-227","slide":227,"title":"Redirect power when the job changes.","copy":"The team added pneumatic control of the cannon’s engagement. Combined with the existing PTO, this let the shared pair serve the wheels, charge the cannon, or power the front extension at different times.","lesson":"The benefit comes from choosing where power is needed—not from adding more motors.","tag":"Version 7 · Build and control","caption":"Original annotated mechanism photographs · slide 227","alt":"Notebook photos of the pneumatic cannon engagement and labeled power connections to the front extension and ball grabber.","powerModes":true},{"label":"Check the benefit","image":"pto-228","slide":228,"title":"A useful change must help the whole run.","copy":"The notebook reports faster intake, cannon release without interrupting four-motor drive, and no need to manually disconnect the cannon. Recorded manual runs went from 25 to 28 balls; autonomous runs from 30 to 39.","lesson":"Hardware, code, and driving strategy changed together. These are recorded run results, not an isolated measurement of the PTO’s effect.","tag":"March 2025 · Recorded results","caption":"Original before-and-after run notes · slide 228","alt":"Notebook results: manual drive 25 to 28 balls with four switches; autonomous drive 30 to 39 balls with two switches."},{"label":"Integrate the gearbox","image":"pto-245","slide":245,"title":"The useful mechanism had become heavy.","copy":"The season review identified weight and complexity in the added-on PTO. For the next version, the team integrated sliding gears into the drivetrain and put all four drive motors on the base, aiming to remove chains and extra supports.","lesson":"Improving a working design can mean rebuilding its structure with fewer parts.","tag":"March 2025 · Redesign for Worlds","caption":"Original integrated drivetrain photograph · slide 245","alt":"Team photo labeling the integrated sliding-gear PTO, wheel output, and common output on the new drivetrain."},{"label":"Refine the shift","image":"pto-246","slide":246,"title":"Small forces can distort a big idea.","copy":"The new PTO needed gears that slid freely. The team supported the pneumatics, kept the push point close to the shaft, and used a rubber band to counter the cylinder’s force on the structure.","lesson":"Alignment and stiffness matter as much as the path the power follows.","tag":"Version 8 · Refine the details","caption":"Original annotated gearbox detail · slide 246","alt":"Team close-up of sliding gears and a common output, with an annotation showing a rubber band countering pneumatic force."},{"label":"Know what to leave out","image":"pto-272","slide":272,"title":"More power was not the next answer.","copy":"A later experiment tried routing four base motors to the conveyor alongside its existing two. It was difficult to stabilize, lost power along the transfer path, and targeted a conveyor that was no longer the bottleneck. The team chose not to implement it.","lesson":"A tested idea can be valuable even when the best decision is to leave it off the robot.","tag":"April 2025 · A deliberate decision","caption":"Original rejected intake prototype · slide 272","alt":"Close-up of the experimental gear assembly for the six-motor intake that the team chose not to implement."}]}};
const assets={"slide-56":"assets/notebook/slide-56.webp","slide-57":"assets/notebook/slide-57.webp","slide-58":"assets/notebook/slide-58.webp","slide-60":"assets/notebook/slide-60.webp","slide-66":"assets/notebook/slide-66.webp","pin-23":"assets/notebook/pin-23.webp","pin-26":"assets/notebook/pin-26.webp","pin-28":"assets/notebook/pin-28.webp","pin-33":"assets/notebook/pin-33.webp","pin-34":"assets/notebook/pin-34.webp","pin-35":"assets/notebook/pin-35.webp","pin-37":"assets/notebook/pin-37.webp","pto-195":"assets/notebook/pto-195.webp","pto-225":"assets/notebook/pto-225.webp","pto-227":"assets/notebook/pto-227.webp","pto-228":"assets/notebook/pto-228.webp","pto-245":"assets/notebook/pto-245.webp","pto-246":"assets/notebook/pto-246.webp","pto-272":"assets/notebook/pto-272.webp"};
assets['pin-23']=q('[data-nb-image]').src;
const caseButtons=qa('[data-nb-case]'),stepButtons=qa('[data-nb-step]'),modeButtons=qa('[data-nb-mode]');
const modes={
 drive:{destination:'Wheels',copy:'Four motors drive the robot. The dedicated intake pair keeps the conveyor available.'},
 charge:{destination:'Cannon charging mechanism',copy:'The shared pair charges the cannon. Two motors remain dedicated to driving and two to the conveyor.'},
 intake:{destination:'Front extension',copy:'Two motors power the front extension while the dedicated pair runs the conveyor: four motors support intake, with two left for driving.'}
};
let selectedCase='pin',selectedStep=0,selectedMode='drive';
const remembered={revolver:0,pin:0,pto:0};
const calm=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||q('.mk-site').classList.contains('mk-calm');
function persist(){try{sessionStorage.setItem('nsf-notebook',JSON.stringify({modelContent:{notebookStory:selectedCase},privateContent:{steps:remembered,mode:selectedMode}}));}catch{}}
function animateEvidence(){const figure=q('.nb-evidence');if(!calm()&&figure.animate)figure.animate([{transform:'perspective(900px) rotateY(-9deg) translateX(-5px)'},{transform:'none'}],{duration:380,easing:'ease-out'});}
function setExpanded(value){q('.nb-spread').classList.toggle('is-expanded',value);q('.nb-expand').setAttribute('aria-expanded',String(value));q('.nb-expand').textContent=value?'Return to story −':'Enlarge detail +';}
function renderStep(index,animate=false){
 const story=stories[selectedCase];selectedStep=Math.max(0,Math.min(story.steps.length-1,index));remembered[selectedCase]=selectedStep;const s=story.steps[selectedStep];
 stepButtons.forEach((b,i)=>{b.hidden=i>=story.steps.length;b.setAttribute('aria-pressed',String(i===selectedStep));if(i<story.steps.length)b.querySelector('b').textContent=story.steps[i].label;});
 q('[data-nb-image]').src=assets[s.image];q('[data-nb-image]').alt=s.alt;
 for(const key of ['tag','title','copy','lesson','caption'])q('[data-nb-'+key+']').textContent=s[key];
 q('[data-nb-source]').href=assets[s.image];
 q('[data-nb-page]').textContent=String(selectedStep+1).padStart(2,'0')+' / '+String(story.steps.length).padStart(2,'0');
 q('[data-nb-prev]').disabled=selectedStep===0;
 q('[data-nb-next]').textContent=selectedStep===story.steps.length-1?'Back to the first idea ↺':'Next experiment →';
 q('[data-nb-power]').hidden=!s.powerModes;
 if(animate)animateEvidence();
}
function renderCase(key,animate=false){
 if(!stories[key])return;selectedCase=key;const story=stories[key];
 caseButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.nbCase===key)));
 q('[data-nb-case-title]').textContent=story.title;q('[data-nb-intro]').textContent=story.intro;q('[data-nb-season]').textContent='Robotex Ninjas · '+story.season;
 q('[data-nb-extra]').hidden=key!=='revolver';setExpanded(false);renderStep(remembered[key],animate);
}
function renderMode(key,animate=false){
 if(!modes[key])return;selectedMode=key;modeButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.nbMode===key)));q('[data-nb-destination]').textContent=modes[key].destination;q('[data-nb-power-copy]').textContent=modes[key].copy;
 const line=q('.nb-power-line');if(animate&&!calm()&&line.animate)line.animate([{transform:'scaleX(.15)',transformOrigin:'left'},{transform:'scaleX(1)',transformOrigin:'left'}],{duration:450,easing:'ease-out'});
}
caseButtons.forEach(b=>b.addEventListener('click',()=>{renderCase(b.dataset.nbCase,true);persist();}));
stepButtons.forEach((b,i)=>b.addEventListener('click',()=>{renderStep(i,true);persist();}));
modeButtons.forEach(b=>b.addEventListener('click',()=>{renderMode(b.dataset.nbMode,true);persist();}));
q('[data-nb-prev]').addEventListener('click',()=>{renderStep(selectedStep-1,true);persist();});
q('[data-nb-next]').addEventListener('click',()=>{renderStep((selectedStep+1)%stories[selectedCase].steps.length,true);persist();});
q('.nb-expand').addEventListener('click',()=>setExpanded(q('.nb-expand').getAttribute('aria-expanded')!=='true'));
q('[data-nb-extra-image]').src=assets['slide-66'];
function restore(state){
 const chosen=state?.modelContent?.notebookStory;if(!stories[chosen])return;
 for(const key of Object.keys(remembered)){const n=state?.privateContent?.steps?.[key];if(Number.isInteger(n)&&n>=0&&n<stories[key].steps.length)remembered[key]=n;}
 renderCase(chosen);renderMode(state?.privateContent?.mode||'drive');
}
renderCase('pin');renderMode('drive');try{restore(JSON.parse(sessionStorage.getItem('nsf-notebook')||'null'));}catch{}
function selectAnchor(){const key={"#notebook-revolver":"revolver","#notebook-pin-catcher":"pin","#notebook-power-sharing":"pto"}[location.hash];if(key)renderCase(key);}
window.addEventListener('hashchange',selectAnchor);selectAnchor();
})();
