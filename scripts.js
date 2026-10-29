function toggleMenu(){var mm=document.getElementById('mm');var hbg=document.getElementById('hbg');mm.classList.toggle('open');hbg.classList.toggle('open');hbg.setAttribute('aria-expanded', hbg.classList.contains('open') ? 'true' : 'false');}
function closeMenu(){document.getElementById('mm').classList.remove('open');document.getElementById('hbg').classList.remove('open');document.getElementById('hbg').setAttribute('aria-expanded','false');}
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
var FOUNDATION_EMAIL = 'contact@ninjasstemfoundation.com';
var ROBOTICS_TEAM_EMAIL = 'robotexninjas@gmail.com';
function inquiryRecipient(topic){
  return topic === 'Join an Existing Robotic Team' || topic === 'Robotex Ninjas Team' ? ROBOTICS_TEAM_EMAIL : FOUNDATION_EMAIL;
}
var PATENT_INQUIRY_TOPIC = 'Patent & IP Assistance';
var TOPIC_SUBTOPICS = {
  'Mentorship': [
    'Requesting mentorship for our VEX IQ team',
    'Requesting mentorship for our V5RC team',
    'Volunteer as a mentor / coach',
    'Other mentorship question'
  ],
  'Workshop / Demo Request': [
    'Host an NSF Robotics Discovery Program',
    'School classroom visit or demonstration',
    'Library or community event',
    'After-school program session',
    'Other event / private request'
  ],
  'Patent & IP Assistance': [],
  'Join an Existing Robotic Team': [
    'Student interested in joining VEX IQ Team 276C',
    'Student interested in joining V5RC Team 91276C',
    'Parent inquiry'
  ],
  'Robotex Ninjas Team': [
    'Team question',
    'Competition / collaboration',
    'Team sponsorship'
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
  if(!document.getElementById('f-topic')) return;
  var topic = document.getElementById('f-topic').value;
  var isPatent = topic === PATENT_INQUIRY_TOPIC;
  var recipient = inquiryRecipient(topic);
  var recipientLink = document.getElementById('f-recipient-email');
  var recipientLabel = document.getElementById('f-recipient-label');
  if(recipientLink){ recipientLink.textContent = recipient; recipientLink.href = 'mailto:' + recipient; }
  if(recipientLabel) recipientLabel.textContent = recipient === ROBOTICS_TEAM_EMAIL ? 'Robotics team inquiries go to' : 'Foundation inquiries go to';
  var row = document.getElementById('f-subtopic-row');
  var sel = document.getElementById('f-subtopic');
  sel.innerHTML = '';
  var subs = TOPIC_SUBTOPICS[topic];
  sel.disabled = isPatent || !subs || !subs.length;
  if(topic && subs && subs.length && !isPatent){
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
  var message = document.getElementById('fm');
  var messageRow = document.getElementById('f-message-row');
  if(messageRow) messageRow.hidden = isPatent;
  message.disabled = isPatent;
  if(isPatent) message.value = '';
  var note = document.getElementById('f-disclosure-note');
  if(note){ note.style.display = isPatent ? 'block' : 'none'; }
  var topicField = document.getElementById('f-topic');
  if(isPatent) topicField.setAttribute('aria-describedby', 'f-disclosure-note');
  else topicField.removeAttribute('aria-describedby');
  var btn = document.getElementById('f-submit-btn');
  if(!btn.disabled) btn.textContent = isPatent ? 'Request Contact \u2192' : 'Send Message \u2192';
}

function preselectTopic(){ if(!document.getElementById('f-topic')) return;
  var params = new URLSearchParams(window.location.search);
  var topic = params.get('topic');
  var subtopic = params.get('subtopic');
  if(topic && TOPIC_SUBTOPICS[topic]){
    document.getElementById('f-topic').value = topic;
  }
  updateSubtopics();
  if(subtopic && topic !== PATENT_INQUIRY_TOPIC){ document.getElementById('f-subtopic').value = subtopic; }
}
preselectTopic();
window.addEventListener('pageshow', function(){
  // Reapply the contact-only fields when a restored page contains a patent inquiry.
  var topic = document.getElementById('f-topic');
  if(topic && topic.value === PATENT_INQUIRY_TOPIC) updateSubtopics();
});

function inquiryDetails(){
  var topic = document.getElementById('f-topic').value;
  var isPatent = topic === PATENT_INQUIRY_TOPIC;
  return {
    name: document.getElementById('fn').value.trim(),
    email: document.getElementById('fe').value.trim(),
    topic: topic,
    isPatent: isPatent,
    subtopic: !isPatent && TOPIC_SUBTOPICS[topic] ? document.getElementById('f-subtopic').value : '',
    message: isPatent ? '' : document.getElementById('fm').value.trim()
  };
}

function inquiryText(details){
  var lines = ['Name: ' + details.name, 'Email: ' + details.email, 'Topic: ' + (details.topic || '(none selected)')];
  if(!details.isPatent){
    if(details.subtopic) lines.push('Subtopic: ' + details.subtopic);
    lines.push('', details.message);
  }
  return lines.join('\n');
}

function emailFormDetails(){
  // Build the draft only when requested, using the current topic and fields.
  var details = inquiryDetails();
  var recipient = inquiryRecipient(details.topic);
  var subject = (recipient === ROBOTICS_TEAM_EMAIL ? '[Robotex Ninjas Inquiry] ' : '[NSF Inquiry] ') + details.topic + (details.subtopic ? ' \u2014 ' + details.subtopic : '');
  window.location.href = 'mailto:' + recipient + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(inquiryText(details));
}

function sendForm(){
  var details = inquiryDetails();
  var subs = TOPIC_SUBTOPICS[details.topic];
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!details.name||!details.email||!details.topic||(!details.isPatent&&!details.message)){
    alert(details.isPatent ? 'Please fill in your name and email.' : 'Please fill in your name, email, message, and select a topic.');return;
  }
  if(!emailPattern.test(details.email)){alert('Please enter a valid email address.');return;}
  if(!details.isPatent && subs && subs.length && !details.subtopic){alert('Please select a more specific option.');return;}

  var recipient = inquiryRecipient(details.topic);
  var subject = (recipient === ROBOTICS_TEAM_EMAIL ? '[Robotex Ninjas Inquiry] ' : '[NSF Inquiry] ') + details.topic + (details.subtopic ? ' \u2014 ' + details.subtopic : '');
  var buttonText = details.isPatent ? 'Request Contact \u2192' : 'Send Message \u2192';
  var btn = document.getElementById('f-submit-btn');
  var ok = document.getElementById('fok');
  var emailFallback = document.getElementById('f-email-fallback');
  btn.disabled = true;
  btn.textContent = 'Sending...';
  ok.style.display = 'none';
  if(emailFallback) emailFallback.hidden = true;
  var controller = new AbortController();
  var timeout = setTimeout(function(){ controller.abort(); }, 20000);

  function fallbackToEmail(noteText){
    clearTimeout(timeout);
    if(emailFallback){
      emailFallback.hidden = false;
    }
    ok.textContent = noteText;
    ok.style.color = 'var(--navy)';
    ok.style.display = 'block';
    btn.disabled = false;
    btn.textContent = buttonText;
  }

  var payload = {
    name: details.name,
    email: details.email,
    topic: details.topic,
    _subject: subject,
    _template: 'table',
    _captcha: 'false',
    // Identify the public form without sending URL query parameters.
    _url: window.location.origin + window.location.pathname
  };
  if(!details.isPatent){
    payload.subtopic = details.subtopic || '(none)';
    payload.message = details.message;
  }
  fetch('https://formsubmit.co/ajax/' + recipient, {
    method: 'POST',
    signal: controller.signal,
    headers: {'Content-Type':'application/json','Accept':'application/json'},
    body: JSON.stringify(payload)
  }).then(function(res){
    return res.json().then(function(result){
      var accepted = result.success === true || result.success === 'true';
      var message = typeof result.message === 'string' ? result.message : '';
      var activationPending = /(?:please|must|need to|to) activat|(?:check|confirm|verify).*(?:email|form)|activat.*(?:required|pending)/i.test(message) || (!accepted && /activat|verif|confirm/i.test(message));
      if(!res.ok || !accepted || activationPending){
        var error = new Error(message || 'The delivery service rejected the request (HTTP ' + res.status + ').');
        error.deliveryResponse = true;
        error.activationPending = activationPending;
        throw error;
      }
    });
  }).then(function(){
    clearTimeout(timeout);
    ok.style.color = '';
    ok.textContent = details.isPatent ? '\u2713   Contact request sent \u2014 thanks! We\u2019ll follow up by email about next steps.' : '\u2713   Message sent \u2014 thanks! We\u2019ll get back to you soon.';
    ok.style.display = 'block';
    ['fn','fe','fm'].forEach(function(id){document.getElementById(id).value='';});
    document.getElementById('f-topic').selectedIndex = 0;
    updateSubtopics();
    btn.disabled = false;
    btn.textContent = 'Send Message \u2192';
  }).catch(function(error){
    var note;
    if(error.activationPending){
      note = 'Direct delivery is awaiting email verification by the website administrator.';
    } else if(error.deliveryResponse){
      note = 'The delivery service did not accept this message. ' + error.message.slice(0,400);
    } else if(error.name === 'AbortError'){
      note = 'The delivery service took too long to respond. We could not confirm delivery.';
    } else {
      note = 'Direct sending is temporarily unavailable. We could not confirm delivery.';
    }
    fallbackToEmail(note + ' Your message is still here. Use Open email app or Copy Details to email ' + recipient + '.');
  });
}

function copyFormDetails(){
  var details = inquiryDetails();
  var recipient = inquiryRecipient(details.topic);
  var text = inquiryText(details);
  var done = function(){
    var ok = document.getElementById('fok');
    ok.textContent = '\u2713   Details copied \u2014 paste them into an email to ' + recipient;
    ok.style.display='block';
  };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done, function(){ alert(text); });
  } else {
    alert(text);
  }
}
if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
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
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
document.addEventListener("keydown",function(e){if(e.key==="Escape")closeMenu();});
