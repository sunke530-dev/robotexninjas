// Run with node scripts/test-contact-inquiry.cjs. All delivery methods are mocked.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../scripts.js'), 'utf8');
const patent = 'Patent & IP Assistance';
const sentinel = 'PRIVATE CONTENT MUST NOT LEAVE THE MESSAGE FIELD';

function setup({ topic = '', subtopic = '', fail = false, hasForm = true, response = { success: true } } = {}) {
  const elements = {};
  const events = {};
  const sent = [], destinations = [], copied = [], alerts = [];
  function element() {
    return {
      value: '', style: {}, disabled: false, hidden: false, textContent: '', attributes: {},
      set innerHTML(value) { this.value = ''; },
      set selectedIndex(value) { if (value === 0) this.value = ''; },
      appendChild() {},
      setAttribute(key, value) { this.attributes[key] = value; },
      removeAttribute(key) { delete this.attributes[key]; }
    };
  }
  if (hasForm) {
    for (const id of ['fn', 'fe', 'fm', 'f-topic', 'f-subtopic', 'f-subtopic-row',
      'f-message-row', 'f-disclosure-note', 'f-submit-btn', 'f-recipient-email', 'f-recipient-label', 'fok']) elements[id] = element();
    elements.fn.value = 'Example Visitor';
    elements.fe.value = 'visitor@example.com';
  }
  const window = {
    location: { search: '?' + new URLSearchParams({ topic, subtopic }), href: '' },
    addEventListener(name, handler) { events[name] = handler; }
  };
  const context = vm.createContext({
    window, URLSearchParams, setTimeout,
    document: { getElementById: id => elements[id], createElement: element, addEventListener() {} },
    navigator: { clipboard: { writeText: text => { copied.push(text); return Promise.resolve(); } } },
    alert: text => alerts.push(text),
    fetch: async (url, options) => {
      sent.push(JSON.parse(options.body));
      destinations.push(url);
      if (fail) throw new Error('Simulated transport failure');
      return { ok: true, json: async () => response };
    }
  });
  vm.runInContext(source, context);
  return { elements, events, context, window, sent, destinations, copied, alerts };
}
const settle = () => new Promise(resolve => setImmediate(resolve));

(async () => {
  const p = setup({ topic: patent, subtopic: sentinel });
  assert.equal(p.elements['f-message-row'].hidden, true);
  assert.equal(p.elements.fm.disabled, true);
  assert.equal(p.elements['f-subtopic-row'].style.display, 'none');
  assert.equal(p.elements['f-subtopic'].disabled, true);
  assert.equal(p.elements['f-subtopic'].value, '');
  assert.equal(p.elements['f-disclosure-note'].style.display, 'block');
  assert.equal(p.elements['f-submit-btn'].textContent, 'Request Contact →');
  // Even stale/autofilled values cannot enter any outbound patent inquiry path.
  p.elements.fm.value = sentinel;
  p.elements['f-subtopic'].value = sentinel;
  p.context.copyFormDetails();
  p.context.sendForm();
  await settle();
  assert.equal(p.sent.length, 1);
  assert.equal(p.destinations[0], 'https://formsubmit.co/ajax/contact@ninjasstemfoundation.com');
  assert.equal(p.elements['f-recipient-email'].href, 'mailto:contact@ninjasstemfoundation.com');
  assert.deepEqual(Object.keys(p.sent[0]).sort(), ['_captcha', '_subject', '_template', 'email', 'name', 'topic']);
  assert.equal(p.sent[0].name, 'Example Visitor');
  assert.equal(p.sent[0].email, 'visitor@example.com');
  assert.equal(p.sent[0].topic, patent);
  assert.ok(!JSON.stringify(p.sent).includes(sentinel));
  assert.equal(p.copied[0], 'Name: Example Visitor\nEmail: visitor@example.com\nTopic: ' + patent);
  assert.match(p.elements.fok.textContent, /Contact request sent/);

  const fallback = setup({ topic: patent, fail: true });
  fallback.elements.fm.value = sentinel;
  fallback.context.sendForm();
  await settle();
  const mail = new URL(fallback.window.location.href);
  assert.equal(mail.protocol, 'mailto:');
  assert.equal(mail.pathname, 'contact@ninjasstemfoundation.com');
  assert.equal(mail.searchParams.get('body'), p.copied[0]);

  const invalid = setup({ topic: patent });
  invalid.elements.fn.value = '';
  invalid.context.sendForm();
  invalid.elements.fn.value = 'Example Visitor';
  invalid.elements.fe.value = 'invalid';
  invalid.context.sendForm();
  assert.equal(invalid.sent.length, 0);
  assert.equal(invalid.alerts.length, 2);

  const normal = setup({ topic: 'Mentorship' });
  assert.equal(normal.elements['f-message-row'].hidden, false);
  assert.equal(normal.elements.fm.disabled, false);
  assert.equal(normal.elements['f-disclosure-note'].style.display, 'none');
  normal.context.sendForm();
  normal.elements.fm.value = 'Please contact our team.';
  normal.context.sendForm();
  assert.equal(normal.sent.length, 0); // Message and specific topic are still required.
  normal.elements['f-subtopic'].value = 'Other mentorship question';
  normal.context.sendForm();
  await settle();
  assert.equal(normal.sent[0].message, 'Please contact our team.');
  assert.equal(normal.sent[0].subtopic, 'Other mentorship question');
  assert.equal(normal.destinations[0], 'https://formsubmit.co/ajax/contact@ninjasstemfoundation.com');

  for (const topic of ['Robotex Ninjas Team', 'Join an Existing Robotic Team']) {
    const team = setup({ topic });
    team.elements['f-subtopic'].value = topic === 'Robotex Ninjas Team' ? 'Team question' : 'Parent inquiry';
    team.elements.fm.value = 'A robotics team inquiry.';
    assert.equal(team.elements['f-recipient-email'].href, 'mailto:robotexninjas@gmail.com');
    team.context.sendForm();
    await settle();
    assert.equal(team.destinations[0], 'https://formsubmit.co/ajax/robotexninjas@gmail.com');
    assert.match(team.sent[0]._subject, /^\[Robotex Ninjas Inquiry\]/);
  }

  const teamFallback = setup({ topic: 'Robotex Ninjas Team', fail: true });
  teamFallback.elements['f-subtopic'].value = 'Team question';
  teamFallback.elements.fm.value = 'Please contact our robotics team.';
  teamFallback.context.copyFormDetails();
  await settle();
  assert.match(teamFallback.elements.fok.textContent, /robotexninjas@gmail\.com/);
  teamFallback.context.sendForm();
  await settle();
  assert.equal(new URL(teamFallback.window.location.href).pathname, 'robotexninjas@gmail.com');

  const activation = setup({ topic: patent, response: { success: 'true', message: 'Check your email to activate this form.' } });
  activation.elements.fm.value = sentinel;
  activation.context.sendForm();
  await settle();
  assert.equal(new URL(activation.window.location.href).pathname, 'contact@ninjasstemfoundation.com');
  assert.ok(!activation.window.location.href.includes(encodeURIComponent(sentinel)));
  assert.doesNotMatch(activation.elements.fok.textContent, /Contact request sent/);

  const switched = setup({ topic: 'General Inquiry', subtopic: 'Sponsorship' });
  assert.equal(switched.elements['f-subtopic'].value, 'Sponsorship');
  switched.elements.fm.value = sentinel;
  switched.elements['f-topic'].value = patent;
  switched.context.updateSubtopics();
  assert.equal(switched.elements.fm.value, '');
  switched.elements.fm.value = sentinel;
  switched.events.pageshow();
  assert.equal(switched.elements.fm.value, '');
  switched.elements['f-topic'].value = 'General Inquiry';
  switched.context.updateSubtopics();
  assert.equal(switched.elements['f-message-row'].hidden, false);
  assert.equal(switched.elements.fm.disabled, false);
  assert.equal(switched.elements['f-submit-btn'].textContent, 'Send Message →');
  switched.elements['f-topic'].value = 'Robotex Ninjas Team';
  switched.context.updateSubtopics();
  assert.equal(switched.elements['f-recipient-email'].textContent, 'robotexninjas@gmail.com');
  switched.elements['f-topic'].value = 'General Inquiry';
  switched.context.updateSubtopics();
  assert.equal(switched.elements['f-recipient-email'].textContent, 'contact@ninjasstemfoundation.com');
  assert.doesNotThrow(() => setup({ hasForm: false }).events.pageshow());
  console.log('Contact inquiry checks passed; no network requests or messages sent.');
})().catch(error => { console.error(error); process.exitCode = 1; });
