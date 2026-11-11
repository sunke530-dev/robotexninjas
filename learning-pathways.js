(()=>{
  document.querySelectorAll('[data-robot-detail]').forEach(button=>button.addEventListener('click',()=>{
    const stage=button.closest('.lp-robot-stage'),detail=!stage.classList.contains('is-detail');
    stage.classList.toggle('is-detail',detail);button.setAttribute('aria-pressed',String(detail));button.textContent=detail?'Show full robot':'Closer look';
  }));
  const steps=[
    {title:'Find the problem before choosing a fix.',copy:'Pins tilted inside the conveyor and missed the revolver opening. The students traced the failure back to bending belts, rather than treating every jam as the same problem.',image:'pin-23',alt:'Original student diagram comparing upright and tilted pins in a conveyor.',caption:'Student notebook · Mix & Match · Intake, page 4',link:'foundation-notebook.html#notebook-pin-catcher',label:'Follow the pin-catcher story →'},
    {title:'Explain why a design should work.',copy:'The team sketched a catcher that could hold a pin at the entrance. The design gave the belts time to grip it without pushing it away as the robot approached.',image:'pin-33',alt:'Original student sketch of a catcher trapping a pin at the conveyor entrance.',caption:'Student notebook · Mix & Match · Intake, page 14',link:'foundation-notebook.html#notebook-pin-catcher',label:'See the idea become a mechanism →'},
    {title:'Make mechanics and code work together.',copy:'A pneumatic linkage closed around the pin. A distance sensor detected its arrival; an optical sensor detected successful intake and told the mechanism when to reset.',image:'pin-35',alt:'Original team photographs of the pin-catching mechanism open and closed.',caption:'Student notebook · Mix & Match · Intake, page 16',link:'foundation-notebook.html#notebook-pin-catcher',label:'Explore the catcher sequence →'},
    {title:'Test the situation the robot will actually face.',copy:'Hand-feeding pins did not reveal every failure. Driving toward them exposed new problems, including pins being pushed away and off-center approaches that needed entrance guides.',image:'pin-37',alt:'Original student diagram showing guides funneling an off-center pin toward the conveyor.',caption:'Student notebook · Mix & Match · Intake, page 18',link:'foundation-notebook.html#notebook-pin-catcher',label:'See what field testing changed →'},
    {title:'Keep the evidence. Question the next change.',copy:'The PTO story records useful power-sharing changes and an idea the team chose not to keep. A more complicated mechanism was not worthwhile once intake was no longer the bottleneck.',image:'pto-272',alt:'Original photograph of an experimental gear assembly the team chose not to implement.',caption:'Student notebook · Rapid Relay · Slide 272',link:'foundation-notebook.html#notebook-power-sharing',label:'Explore the power-sharing decisions →'}
  ];
  const process=document.querySelector('[data-learning-process]');
  if(process){
    const buttons=[...process.querySelectorAll('[data-learning-step]')];
    buttons.forEach((button,i)=>button.addEventListener('click',()=>{
      const step=steps[i];buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));
      process.querySelector('[data-learning-title]').textContent=step.title;process.querySelector('[data-learning-copy]').textContent=step.copy;
      const image=process.querySelector('[data-learning-image]');image.src='assets/notebook/'+step.image+'.webp';image.alt=step.alt;
      process.querySelector('[data-learning-caption]').textContent=step.caption;const link=process.querySelector('[data-learning-link]');link.href=step.link;link.textContent=step.label;
    }));
  }
  const brief=document.querySelector('[data-case-brief]');
  if(brief){
    const briefs={
      pin:['Pins leaned, jammed, or escaped before the conveyor could collect them.','Combine belt synchronization, a pneumatic catcher, sensors, and entrance guides.','150 recorded intake trials found seven serious errors after belt synchronization. Later field tests revealed additional problems to solve.','Mechanical alignment · Control logic · Testing under real conditions'],
      revolver:['Pin stacks and their support doors caught on uneven surfaces.','Compare smoother surfaces, raised supports, and small slopes at the contact points.','The notebook records smoother rotation after filling gaps and adding sloped pieces. It does not give a timed performance comparison.','Friction · Clearance · Iterative prototyping'],
      pto:['Driving, cannon charging, and ball collection competed for limited motor power.','Route the same motor pair to different jobs, then improve the gearbox and its supports.','Recorded runs improved from 25 to 28 balls manually and 30 to 39 autonomously. Hardware, code, and strategy changed together.','Power transmission · Trade-offs · Interpreting evidence']
    };
    const sync=()=>{const chosen=document.querySelector('[data-nb-case][aria-pressed=true]');const data=briefs[chosen?.dataset.nbCase];if(!data)return;brief.querySelectorAll('dd').forEach((el,i)=>el.textContent=data[i]);document.querySelector('[data-case-skills]').textContent='Skills in this story: '+data[3];};
    sync();document.querySelectorAll('[data-nb-case]').forEach(button=>button.addEventListener('click',sync));window.addEventListener('hashchange',sync);
  }
})();
