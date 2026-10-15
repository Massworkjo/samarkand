# CLAUDE.md — samarqandsweets.com

> Loaded at the start of every session in this repo. `README.md` is the full reference; read it
> before changing anything. This file holds only what must never be missed.

## 0. The Samarqand family, and how the owner works

This repo is one of four that will become **one Samarqand platform**. Order of work, agreed
2026-10-15: **organise → finish each app → merge.** Merge design is decided in the
"Full mass group" Claude project, not inside one repo.

| Repo | What it is | State (2026-10-15) |
|---|---|---|
| `Massworkjo/samarqand-hr` | HR PWA, one `index.html` on Firebase | 🟢 **LIVE**, real employees |
| `Massworkjo/Samarqand-ERP` | Cash Van ERP: Django + PostgreSQL, Flutter handset, Arabic panel | built, not yet proven live |
| `Massworkjo/samarkand` | `samarqandsweets.com` marketing site, GitHub Pages | live site |
| `Massworkjo/Masswork-privet-` | private tooling (GitHub + Drive upload script) | tooling |

**Working with the owner (Momen), binding:**
- **No PC.** Never ask the owner to run a command, open a local path, or approve a device session.
  Code goes to GitHub (branch + draft PR). Anything a person reads (report, map, roadmap, brief)
  goes to **Google Drive → `Full Mass Group/<HR|ERP|Samarkand|Private>`**, not only into the repo.
- **Every question is a clickable choice** with an **Other** option (`ask_decision` card in Projects,
  `AskUserQuestion` in Claude Code). Never a typed A/B/C list.
- **Show proof**: links, test output, screenshots. Prefer a visual map or roadmap over a wall of text.
- **Let running agents finish.** Never rebase, force-push or delete a branch you did not create.

**Daily skills scout.** Every morning at 05:55 Asia/Amman a scheduled task ("Morning skills scout")
looks for new Claude skills, plugins and MCP connectors that fit this stack (Django/DRF/PostgreSQL,
Flutter, Arabic RTL back-office, HR, ERP/accounting, website). It writes `Skills scout YYYY-MM-DD`
as a Google Doc in Drive `Full Mass Group` and posts one Install / Skip / Later card per candidate.
**Nothing is installed without the owner's answer on that card.** Usage rules: one plugin per job
(no overlapping plugins), irrelevant plugins stay switched off, routine and scheduled work runs on
cheaper models, finished threads get resolved.

## 1. Rules

- **Pushing to `main` publishes the site** (GitHub Pages, `CNAME`). Work on a branch + draft PR.
- Run `node tests/events.test.mjs` before every push; it exits non-zero on failure.
- Preview over HTTP (`python -m http.server 5178`), never `file://`. Attach phone + desktop
  screenshots to the PR; use `?now=YYYY-MM-DD` to show event states.
- **`events.json`:** `attending: true` only when Samarqand really exhibits. Never guess a date: mark it
  `unverified` or leave it `null`, with a `source_url`.
- **Brand:** the July 2026 guideline `قايد لاين سمرقند` (Drive, *05 - Brand, Design and Marketing*).
  The 2024 chocolate/gold guideline is superseded. Text is one ink, `#1F2D2B`; the seven `:root`
  fills are the only surface colours.
