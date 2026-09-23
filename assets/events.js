// Event calendar logic. Pure functions — no DOM — so tests/events.test.mjs can run them in Node.
// Data lives in /events.json; this file only decides what the site should show *today*.

// The calendar day (YYYY-MM-DD) that it currently is in `timeZone`. A show in Riyadh opens on
// Riyadh's date, not the visitor's: at 23:30 in Amman on the 1st it is already the 2nd in Dubai.
export function dayIn(timeZone, now = new Date()) {
  // en-CA formats as YYYY-MM-DD, which also sorts correctly as a string
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

// 'tba' | 'upcoming' | 'live' | 'past'
export function status(ev, now = new Date()) {
  if (!ev.start || !ev.end) return 'tba';
  const today = dayIn(ev.timezone || 'Asia/Amman', now);
  if (today < ev.start) return 'upcoming';
  if (today > ev.end) return 'past';
  return 'live';
}

// Whole days from `now` until the event opens, counted in the event's own time zone.
export function daysUntil(ev, now = new Date()) {
  const today = dayIn(ev.timezone || 'Asia/Amman', now);
  return Math.round((Date.parse(ev.start) - Date.parse(today)) / 864e5);
}

// Which event, if any, should take over the site. Only events Samarqand attends qualify:
// the site must never imply the company is at a show it isn't going to.
// A live show wins; otherwise the soonest attended show opening within `leadDays`.
export function featured(events, now = new Date(), leadDays = 45) {
  const mine = events.filter(e => e.attending);
  const live = mine.filter(e => status(e, now) === 'live');
  if (live.length) return { ev: live.sort((a, b) => a.end.localeCompare(b.end))[0], state: 'live' };
  const soon = mine
    .filter(e => status(e, now) === 'upcoming' && daysUntil(e, now) <= leadDays)
    .sort((a, b) => a.start.localeCompare(b.start));
  return soon.length ? { ev: soon[0], state: 'upcoming', days: daysUntil(soon[0], now) } : null;
}

// Calendar order reads by date, not by importance: dated events ascending, TBA after them,
// past events last (newest first). Attendance is shown with a badge, not by reordering.
export function ordered(events, now = new Date()) {
  const rank = { live: 0, upcoming: 0, tba: 1, past: 2 };
  return [...events].sort((a, b) => {
    const sa = status(a, now), sb = status(b, now);
    if (rank[sa] !== rank[sb]) return rank[sa] - rank[sb];
    if (sa === 'past') return b.start.localeCompare(a.start);
    if (sa === 'tba') return (a.name_en || '').localeCompare(b.name_en || '');
    return a.start.localeCompare(b.start);
  });
}

// iCalendar text for "add to calendar". All-day events: DTEND is exclusive, so it is end + 1 day.
export function ics(ev, url = 'https://www.samarqandsweets.com/') {
  const d = s => s.replaceAll('-', '');
  const endExcl = new Date(Date.parse(ev.end) + 864e5).toISOString().slice(0, 10);
  const esc = s => String(s || '').replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  const where = [ev.venue_en, ev.city_en].filter(Boolean).join(', ');
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Samarqand Sweets//Events//EN', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${ev.id}@samarqandsweets.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART;VALUE=DATE:${d(ev.start)}`,
    `DTEND;VALUE=DATE:${d(endExcl)}`,
    `SUMMARY:${esc(ev.name_en)}${ev.attending ? esc(' — meet Samarqand') + (ev.booth ? esc(` (${ev.booth})`) : '') : ''}`,
    `LOCATION:${esc(where)}`,
    `URL:${ev.url || url}`,
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n');
}
