// Run: node tests/events.test.mjs   (exit code 0 = pass)
import assert from 'node:assert/strict';
import { dayIn, status, daysUntil, featured, ordered, ics } from '../assets/events.js';

const at = iso => new Date(iso);
const show = { id: 'sfs', name_en: 'Show', start: '2026-11-10', end: '2026-11-12', timezone: 'Asia/Riyadh', attending: true };

// dayIn uses the event's zone, not UTC: 22:30 UTC on Nov 9 is already Nov 10 in Riyadh (UTC+3)
assert.equal(dayIn('Asia/Riyadh', at('2026-11-09T22:30:00Z')), '2026-11-10');
assert.equal(dayIn('UTC', at('2026-11-09T22:30:00Z')), '2026-11-09');

// status boundaries: first and last day are both live
assert.equal(status(show, at('2026-11-09T20:59:00Z')), 'upcoming'); // 23:59 Riyadh on the 9th
assert.equal(status(show, at('2026-11-09T21:00:00Z')), 'live');     // 00:00 Riyadh on the 10th
assert.equal(status(show, at('2026-11-12T20:59:00Z')), 'live');     // 23:59 Riyadh, last day
assert.equal(status(show, at('2026-11-12T21:00:00Z')), 'past');
assert.equal(status({ ...show, start: null, end: null }), 'tba');

assert.equal(daysUntil(show, at('2026-11-01T09:00:00Z')), 9);

// featured: never an event the company is not attending
const industry = { ...show, id: 'other', attending: false, start: '2026-10-01', end: '2026-10-03' };
assert.equal(featured([industry], at('2026-10-02T09:00:00Z')), null);

// featured: countdown inside the lead window, nothing outside it
assert.equal(featured([show], at('2026-09-01T09:00:00Z')), null);            // 70 days out
assert.deepEqual(featured([show], at('2026-11-01T09:00:00Z')), { ev: show, state: 'upcoming', days: 9 });
assert.equal(featured([show], at('2026-11-11T09:00:00Z')).state, 'live');
assert.equal(featured([show], at('2026-11-20T09:00:00Z')), null);             // over

// a live show beats a sooner-starting upcoming one
const later = { ...show, id: 'later', start: '2026-11-13', end: '2026-11-15' };
assert.equal(featured([later, show], at('2026-11-11T09:00:00Z')).ev.id, 'sfs');

// ordering: dated ascending, then TBA, then past newest-first
const past1 = { ...show, id: 'p1', start: '2026-09-04', end: '2026-09-06' };
const past2 = { ...show, id: 'p2', start: '2026-05-01', end: '2026-05-03' };
const tba = { ...show, id: 'tba', name_en: 'Zed', start: null, end: null };
const ids = ordered([past2, tba, later, past1, show], at('2026-10-01T09:00:00Z')).map(e => e.id);
assert.deepEqual(ids, ['sfs', 'later', 'tba', 'p1', 'p2']);

// ics: all-day DTEND is exclusive (end + 1), commas escaped, CRLF line endings
const cal = ics({ ...show, venue_en: 'Riyadh Front, Hall 1', city_en: 'Riyadh', booth: 'B12' });
assert.match(cal, /DTSTART;VALUE=DATE:20261110/);
assert.match(cal, /DTEND;VALUE=DATE:20261113/);
assert.match(cal, /LOCATION:Riyadh Front\\, Hall 1\\, Riyadh/);
assert.match(cal, /\(B12\)/);
assert.ok(cal.includes('\r\n'));
// month rollover in DTEND
assert.match(ics({ ...show, end: '2026-11-30' }), /DTEND;VALUE=DATE:20261201/);

console.log('events: all checks passed');
