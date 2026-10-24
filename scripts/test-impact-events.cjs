const assert = require('node:assert/strict');
const { dayInChicago, validDate, stateFor, pastVenues, mergeVenues, reportStatusFor } = require('../foundation-impact-events.js');
const davis = { id: 'davis', date: '2026-10-24', dateLabel: 'October 24, 2026', title: 'STEAM Showcase', summary: 'Report pending.', venue: { id: 'davis-library', coordinates: [-96.750231212154, 33.08036228002] } };
const haggard = { ...davis, id: 'haggard', date: '2026-11-07', venue: { id: 'haggard-library', coordinates: [-96.770210724608, 33.03190900745] } };
const state = at => stateFor([davis, haggard], new Date(at));
assert.equal(dayInChicago(new Date('2026-10-25T04:59:59.999Z')), '2026-10-24');
assert.equal(state('2026-10-22T17:00:00Z').past.length, 0);
assert.equal(state('2026-10-25T04:59:59.999Z').past.length, 0, 'Davis stays upcoming through its event day');
const completedDavis = { ...davis, status: 'completed', reportStatus: 'recorded', gallery: 'davis-library' };
const completion = stateFor([completedDavis, haggard], new Date('2026-10-24T21:30:00Z'));
assert.deepEqual(completion.past.map(e => e.id), ['davis'], 'Confirmed completion moves Davis on its event day');
assert.deepEqual(completion.upcoming.map(e => e.id), ['haggard'], 'Haggard remains upcoming');
assert.equal(stateFor([completedDavis], new Date('2026-10-23T17:00:00Z')).past.length, 0, 'A future event is not archived early');
assert.equal(pastVenues(completion.past)[0].href, 'gallery.html#davis-library');
assert.equal(reportStatusFor(pastVenues(completion.past)[0]), 'recorded');
assert.deepEqual(state('2026-10-25T05:00:00Z').past.map(e => e.id), ['davis']);
assert.deepEqual(state('2026-11-08T05:59:59.999Z').past.map(e => e.id), ['davis'], 'Haggard stays upcoming until Central midnight after DST ends');
assert.deepEqual(state('2026-11-08T06:00:00Z').past.map(e => e.id), ['haggard', 'davis']);
assert.equal(state('2026-11-08T06:00:00Z').upcoming.length, 0);
assert.equal(dayInChicago(new Date('2027-03-15T04:59:59Z')), '2027-03-14', 'Spring DST uses Central daylight time');
assert.equal(dayInChicago(new Date('2027-03-15T05:00:00Z')), '2027-03-15');
const special = [
  { id: 'unknown' }, { id: 'invalid', date: '2026-02-30' },
  { id: 'ambiguous', date: '10/24/2026' }, { ...davis, id: 'cancelled', status: 'cancelled' },
  { ...davis, id: 'reversed', endDate: '2026-10-23' },
  { ...davis, id: 'multi-day', endDate: '2026-10-26' }
];
assert.equal(stateFor(special, new Date('2026-10-26T17:00:00Z')).past.length, 0);
assert.deepEqual(stateFor(special, new Date('2026-10-27T05:00:00Z')).past.map(e => e.id), ['multi-day']);
assert.equal(validDate('2028-02-29'), true);
assert.equal(validDate('2026-02-29'), false);
const groups = pastVenues([davis, { ...davis, id: 'second-visit' }, { ...davis, id: 'no-location', venue: null }, { ...davis, venue: { id: 'bad', coordinates: [999, 999] } }]);
assert.equal(groups.length, 1, 'Repeat visits share a pin and unverified coordinates stay off the map');
assert.equal(groups[0].events.length, 2);
assert.equal(groups[0].href, '#davis');
const recorded = [{ id: 'davis-library', events: [{ title: 'Earlier visit' }] }];
assert.equal(mergeVenues(recorded, groups)[0].events.length, 3);
assert.equal(recorded[0].events.length, 1, 'Map refresh must not mutate earlier records');
assert.equal(reportStatusFor(groups[0]), 'pending', 'A past date alone is not evidence that a program took place');
assert.equal(reportStatusFor(recorded[0]), 'recorded', 'Existing published recaps keep their recorded status');
assert.equal(reportStatusFor(mergeVenues(recorded, groups)[0]), 'mixed', 'Repeat visits preserve pending status alongside an earlier recap');
assert.equal(reportStatusFor(pastVenues([{ ...davis, reportStatus: 'recorded' }])[0]), 'recorded', 'A verified recap can be explicitly marked recorded');
assert.equal(reportStatusFor(pastVenues([{ ...davis, reportStatus: 'unknown' }])[0]), 'pending', 'An unknown status cannot imply a verified recap');
console.log('Impact event tests passed: Central midnight, both DST offsets, end dates, invalid/cancelled dates, sorting, grouping and unchanged earlier records.');
