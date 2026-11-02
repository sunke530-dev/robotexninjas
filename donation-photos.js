/* Photo controls are independent of the donation/payment embed. */
(function(){
  const carousel = document.getElementById('donation-photos');
  if(!carousel) return;
  const slides = Array.from(carousel.querySelectorAll('.donate-photo-slide'));
  const controls = carousel.querySelector('.donate-photo-controls');
  const choices = Array.from(carousel.querySelectorAll('[data-photo]'));
  const toggle = carousel.querySelector('.donate-photo-toggle');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let paused = motion.matches;
  let hovered = false;
  let focused = false;
  let timer;
  function schedule(){
    clearTimeout(timer);
    if(paused || hovered || focused || document.hidden) return;
    timer = setTimeout(function(){
      show((current + 1) % slides.length);
      schedule();
    }, 7000);
  }
  function show(index){
    const image = slides[index].querySelector('img');
    if(!image.complete || !image.naturalWidth) return;
    current = index;
    slides.forEach(function(slide, i){
      slide.classList.toggle('is-active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
      choices[i].setAttribute('aria-pressed', String(i === current));
    });
  }
  function update(){
    toggle.textContent = paused ? 'Play slideshow' : 'Pause slideshow';
    schedule();
  }
  slides.forEach(function(slide, i){
    slide.hidden = false;
    slide.setAttribute('aria-hidden', String(i !== current));
  });
  controls.hidden = false;
  choices.forEach(function(choice){
    choice.addEventListener('click', function(){
      show(Number(choice.dataset.photo));
      paused = true;
      update();
    });
  });
  toggle.addEventListener('click', function(){ paused = !paused; update(); });
  carousel.addEventListener('mouseenter', function(){ hovered = true; schedule(); });
  carousel.addEventListener('mouseleave', function(){ hovered = false; schedule(); });
  carousel.addEventListener('focusin', function(){ focused = true; schedule(); });
  carousel.addEventListener('focusout', function(event){
    if(carousel.contains(event.relatedTarget)) return;
    focused = false;
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', function(event){
    if(event.matches){ paused = true; update(); }
  });
  update();
})();
