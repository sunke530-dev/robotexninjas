function toggleMenu(){var mm=document.getElementById('mm');var hbg=document.getElementById('hbg');mm.classList.toggle('open');hbg.classList.toggle('open');hbg.setAttribute('aria-expanded', hbg.classList.contains('open') ? 'true' : 'false');}
function closeMenu(){document.getElementById('mm').classList.remove('open');document.getElementById('hbg').classList.remove('open');}
function showInvolveTab(tab){
  var ways = document.getElementById('involve-panel-ways');
  var openings = document.getElementById('involve-panel-openings');
  var btnWays = document.getElementById('involve-tab-ways');
  var btnOpenings = document.getElementById('involve-tab-openings');
  if(tab === 'openings'){
    ways.style.display = 'none';
    openings.style.display = 'block';
    btnOpenings.classList.add('active');
    btnWays.classList.remove('active');
  } else {
    ways.style.display = 'block';
    openings.style.display = 'none';
    btnWays.classList.add('active');
    btnOpenings.classList.remove('active');
  }
}
var TOPIC_SUBTOPICS = {
  'Mentorship': [
    'Requesting mentorship for our VEX IQ team',
    'Requesting mentorship for our V5RC team',
    'Volunteer as a mentor / coach',
    'Other mentorship question'
  ],
  'Workshop / Demo Request': [
    'School classroom visit or demonstration',
    'Library or community event',
    'After-school program session',
    'Other event / private request'
  ],
  'Patent & IP Assistance': [
    'Patent application filing',
    'Patent landscape / prior art search',
    'Invention disclosure guidance',
    'Early-stage business / entrepreneurship advice'
  ],
  'Join an Existing Robotic Team': [
    'Student interested in joining VEX IQ Team 276C',
    'Student interested in joining V5RC Team 91276C',
    'Parent inquiry'
  ],
  'General Inquiry': [
    'Volunteering (non-mentoring)',
    'School / organization partnership',
    'Sponsorship',
    'Media / press',
    'Something else'
  ]
};

function updateSubtopics(){
  var topic = document.getElementById('f-topic').value;
  var row = document.getElementById('f-subtopic-row');
  var sel = document.getElementById('f-subtopic');
  sel.innerHTML = '';
  var subs = TOPIC_SUBTOPICS[topic];
  if(topic && subs){
    var opt0 = document.createElement('option');
    opt0.value = ''; opt0.textContent = 'Select one...';
    sel.appendChild(opt0);
    subs.forEach(function(s){
      var opt = document.createElement('option');
      opt.value = s; opt.textContent = s;
      sel.appendChild(opt);
    });
    row.style.display = 'block';
  } else {
    row.style.display = 'none';
  }
  var note = document.getElementById('f-disclosure-note');
  if(note){ note.style.display = (topic === 'Patent &amp; IP Assistance' || topic === 'Patent & IP Assistance') ? 'block' : 'none'; }
}

function preselectTopic(){ if(!document.getElementById('f-topic')) return;
  var params = new URLSearchParams(window.location.search);
  var topic = params.get('topic');
  var subtopic = params.get('subtopic');
  if(topic && TOPIC_SUBTOPICS[topic]){
    document.getElementById('f-topic').value = topic;
    updateSubtopics();
    if(subtopic){ document.getElementById('f-subtopic').value = subtopic; }
  }
}
preselectTopic();

function sendForm(){
  var fn=document.getElementById('fn').value.trim();
  var fe=document.getElementById('fe').value.trim();
  var fm=document.getElementById('fm').value.trim();
  var topic=document.getElementById('f-topic').value;
  var subs=TOPIC_SUBTOPICS[topic];
  var subtopic = subs ? document.getElementById('f-subtopic').value : '';
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!fn||!fe||!fm||!topic){alert('Please fill in your name, email, message, and select a topic.');return;}
  if(!emailPattern.test(fe)){alert('Please enter a valid email address.');return;}
  if(subs && !subtopic){alert('Please select a more specific option.');return;}

  var subject = '[NSF Inquiry] ' + topic + (subtopic ? ' \u2014 ' + subtopic : '');
  var btn = document.getElementById('f-submit-btn');
  var ok = document.getElementById('fok');
  btn.disabled = true;
  btn.textContent = 'Sending...';

  function fallbackToEmail(noteText){
    var bodyLines = ['Name: ' + fn, 'Email: ' + fe, 'Topic: ' + topic];
    if(subtopic) bodyLines.push('Subtopic: ' + subtopic);
    bodyLines.push('', fm);
    var mailto = 'mailto:robotexninjas@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyLines.join('\n'));
    window.location.href = mailto;
    ok.textContent = noteText;
    ok.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Send Message \u2192';
  }

  fetch('https://formsubmit.co/ajax/robotexninjas@gmail.com', {
    method: 'POST',
    headers: {'Content-Type':'application/json','Accept':'application/json'},
    body: JSON.stringify({
      name: fn,
      email: fe,
      topic: topic,
      subtopic: subtopic || '(none)',
      message: fm,
      _subject: subject,
      _template: 'table',
      _captcha: 'false'
    })
  }).then(function(res){
    if(!res.ok) throw new Error('FormSubmit response not OK');
    return res.json();
  }).then(function(){
    ok.textContent = '\u2713   Message sent \u2014 thanks! We\u2019ll get back to you soon.';
    ok.style.display = 'block';
    ['fn','fe','fm'].forEach(function(id){document.getElementById(id).value='';});
    document.getElementById('f-topic').selectedIndex = 0;
    updateSubtopics();
    btn.disabled = false;
    btn.textContent = 'Send Message \u2192';
  }).catch(function(){
    fallbackToEmail('\u26a0\uFE0F   Could not send directly \u2014 opening your email app instead. If nothing opens, email robotexninjas@gmail.com.');
  });
}

function copyFormDetails(){
  var fn=document.getElementById('fn').value.trim();
  var fe=document.getElementById('fe').value.trim();
  var fm=document.getElementById('fm').value.trim();
  var topic=document.getElementById('f-topic').value;
  var subs=TOPIC_SUBTOPICS[topic];
  var subtopic = subs ? document.getElementById('f-subtopic').value : '';
  var lines = ['Name: ' + fn, 'Email: ' + fe, 'Topic: ' + (topic||'(none selected)')];
  if(subtopic) lines.push('Subtopic: ' + subtopic);
  lines.push('', fm);
  var text = lines.join('\n');
  var done = function(){
    var ok = document.getElementById('fok');
    ok.textContent = '\u2713   Details copied \u2014 paste them into an email to robotexninjas@gmail.com';
    ok.style.display='block';
  };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done, function(){ alert(text); });
  } else {
    alert(text);
  }
}
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){e.target.style.animation='fadeIn .5s ease both';io.unobserve(e.target);}
    });
  },{threshold:0.08});
  document.querySelectorAll('.pillar-card,.program-card,.leader-card,.involve-card,.impact-card').forEach(function(el){io.observe(el);});
}

// ── NSF COUNTER ANIMATION ──
(function(){
  function easeOutQuart(t){ return 1 - Math.pow(1-t, 4); }

  function animateGroup(els){
    var duration = 3000;
    var start = null;
    var targets = Array.from(els).map(function(el){
      return { el:el, target:parseInt(el.dataset.target,10), suffix:el.dataset.suffix||'', prefix:el.dataset.prefix||'' };
    });
    targets.forEach(function(c){ /* keep the real value visible until the first animation frame */ });
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts-start)/duration, 1);
      var e = easeOutQuart(p);
      targets.forEach(function(c){
        c.el.textContent = c.prefix + Math.round(e * c.target) + c.suffix;
      });
      if(p < 1){ requestAnimationFrame(step); }
      else { targets.forEach(function(c){ c.el.textContent = c.prefix + c.target + c.suffix; }); }
    }
    requestAnimationFrame(step);
  }

  function watchSection(id){
    var section = document.getElementById(id);
    if(!section) return;
    var done = false;
    function checkVisibility(){
      if(done) return;
      var rect = section.getBoundingClientRect();
      if(rect.top < window.innerHeight * 0.88 && rect.bottom > 0){
        done = true;
        animateGroup(section.querySelectorAll('.nsf-counter'));
        window.removeEventListener('scroll', checkVisibility);
      }
    }
    window.addEventListener('scroll', checkVisibility, { passive:true });
    setTimeout(checkVisibility, 400);
  }

  watchSection('nsf-stats-bar');
  watchSection('nsf-impact-grid');
})();