(function (scope) {
  'use strict';
  const zone = 'America/Chicago';
  const calendar = new Intl.DateTimeFormat('en-US', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' });
  function dayInChicago(now = new Date()) {
    const parts = Object.fromEntries(calendar.formatToParts(now).map(part => [part.type, part.value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
  }
  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
    const parsed = new Date(`${value}T12:00:00Z`);
    return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }
  function hasPassed(event, today) {
    const end = event.endDate || event.date;
    return event.status !== 'cancelled' && validDate(event.date) && validDate(end) && end >= event.date &&
      (end < today || (event.status === 'completed' && end === today));
  }
  function stateFor(events, now = new Date()) {
    const today = dayInChicago(now);
    return {
      today,
      past: events.filter(event => hasPassed(event, today)).sort((a, b) => (b.endDate || b.date).localeCompare(a.endDate || a.date)),
      upcoming: events.filter(event => !hasPassed(event, today))
    };
  }
  function pastVenues(events) {
    const venues = new Map();
    for (const event of events) {
      const venue = event.venue;
      if (!venue || !Array.isArray(venue.coordinates) || venue.coordinates.length !== 2 ||
          !venue.coordinates.every(Number.isFinite) || Math.abs(venue.coordinates[0]) > 180 || Math.abs(venue.coordinates[1]) > 90) continue;
      if (!venues.has(venue.id)) venues.set(venue.id, { ...venue, events: [],
        href: event.gallery ? `gallery.html#${encodeURIComponent(event.gallery)}` : `#${event.id}`,
        linkText: event.gallery ? 'See event photos ↗' : 'Read event record →' });
      venues.get(venue.id).events.push({ title: event.title, date: event.dateLabel, description: event.summary,
        reportStatus: event.reportStatus === 'recorded' ? 'recorded' : 'pending' });
    }
    return [...venues.values()];
  }
  function mergeVenues(recorded, scheduled) {
    const venues = new Map(recorded.map(venue => [venue.id, { ...venue, events: [...venue.events] }]));
    for (const venue of scheduled) {
      if (venues.has(venue.id)) venues.get(venue.id).events.push(...venue.events);
      else venues.set(venue.id, { ...venue, events: [...venue.events] });
    }
    return [...venues.values()];
  }
  function reportStatusFor(venue) {
    const pending = venue.events.filter(event => event.reportStatus === 'pending').length;
    return pending === 0 ? 'recorded' : pending === venue.events.length ? 'pending' : 'mixed';
  }
  const api = { dayInChicago, validDate, stateFor, pastVenues, mergeVenues, reportStatusFor };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  scope.NSFImpactEvents = api;
  if (!scope.document) return;

  const document = scope.document;
  const archive = document.getElementById('date-based-past-events');
  const posterArchive = document.getElementById('past-event-posters');
  if (!archive || !posterArchive) return;
  const records = [...document.querySelectorAll('[data-impact-event]')].map(card => {
    const template = card.querySelector('template[data-past-event]');
    if (!template?.content.firstElementChild) return null;
    const slot = document.createComment(`Event position: ${card.id}`);
    card.before(slot);
    const pastCard = template.content.firstElementChild.cloneNode(true);
    pastCard.id = card.id; // Keep existing event deep links after the move.
    const coordinates = (card.dataset.coordinates || '').split(',').map(Number);
    return {
      id: card.id, date: card.dataset.eventDate, endDate: card.dataset.eventEndDate,
      status: card.dataset.eventStatus, reportStatus: card.dataset.reportStatus, title: card.querySelector('h3').textContent,
      dateLabel: card.dataset.dateLabel, summary: card.dataset.mapSummary, gallery: card.dataset.galleryAnchor,
      venue: card.dataset.venueId ? {
        id: card.dataset.venueId, name: card.dataset.venueName, short: card.dataset.venueShort,
        address: card.dataset.venueAddress, coordinates
      } : null,
      card, pastCard, slot
    };
  }).filter(Boolean);
  const posters = [...document.querySelectorAll('[data-event-poster-for]')].map(poster => {
    const slot = document.createComment('Shared poster position');
    poster.before(slot);
    return { poster, slot, ids: poster.dataset.eventPosterFor.split(/\s+/) };
  });
  let currentState;
  function refresh() {
    const next = stateFor(records);
    if (currentState?.today === next.today) return;
    const pastIds = new Set(next.past.map(event => event.id));
    for (const record of records) {
      if (pastIds.has(record.id)) record.card.remove();
      else record.slot.after(record.card);
    }
    archive.replaceChildren(...next.past.map(record => record.pastCard));
    for (const { poster, slot, ids } of posters) {
      if (ids.length && ids.every(id => pastIds.has(id))) posterArchive.append(poster);
      else slot.after(poster);
    }
    const empty = document.getElementById('upcoming-events-empty');
    if (empty) empty.hidden = next.upcoming.length !== 0;
    currentState = next;
    scope.dispatchEvent(new CustomEvent('nsf:impact-events-changed'));
  }
  api.getPastVenues = () => pastVenues(currentState?.past || []);
  refresh();
  // A tab left open overnight or restored from the background updates too.
  scope.setInterval(refresh, 60000);
  scope.addEventListener('pageshow', refresh);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  const targetId = decodeURIComponent(scope.location.hash.slice(1));
  if (currentState.past.some(event => event.id === targetId)) {
    scope.requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView());
  }
})(typeof window !== 'undefined' ? window : globalThis);
