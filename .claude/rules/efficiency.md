# Efficiency rules (owner request, 2026-10-16)

Loaded automatically with CLAUDE.md. Every token in context is re-read on every turn,
so a small context means faster and cheaper work. Keep this file short.

## Context
- **One task per session.** When a task is finished and verified, say so and suggest `/clear`
  before starting something unrelated.
- **Auto-compact runs at 40% of the context window**, set by `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=40` in
  `.claude/settings.json`. Before a big step, run `/compact` yourself if the session is already
  long, and keep the summary focused on the current task.
- **Read narrowly.** Use Grep/Glob first, then read only the lines you need (`offset`/`limit`).
  Never read a whole large file, lockfile, migration dump or generated file to "get a feel".
- **Keep tool output small.** Pipe long commands through `| tail -50` or `| grep`, run tests
  with quiet flags, and print summaries rather than whole tables.
- **Hand broad searches to a subagent** (Explore, `model: haiku`) and keep only its conclusion,
  so file dumps never land in the main session.

## Plugins, skills and MCP tools
- Use the smallest set that does the job. **Default kit for this project:** GitHub, Google
  Drive/Docs, Context7 (library docs), Firecrawl (web), and the `engineering:*` and
  `code-review` skills.
- Load anything else (design, data, finance, browser, etc.) only when the task clearly needs
  it. Never load a tool just to look around.
- If a plugin is never used here, say so once and suggest disabling it with
  `"enabledPlugins": {"<name>@<marketplace>": false}` in `.claude/settings.json`.

## Models: the right size for the job
| Work | Model |
|---|---|
| Searching, listing, summarising, simple edits, docs | `haiku` subagent |
| Normal coding, tests, reviews, CI fixes | `sonnet` (default for subagents) |
| Architecture, money/ledger/tax logic, security, migrations on live data | `opus` |
| Plan with Opus, then build with Sonnet | `/model opusplan` |

- Spawn subagents with an explicit `model` (`haiku` / `sonnet` / `opus`) instead of always
  inheriting the main model.
- Use low effort for docs and summaries, and high effort only for hard reasoning.
- Never put a model name in commits, PRs or code.

## Habits
- Plan briefly, then act. Don't re-derive what CHECKPOINT.md, memory or the thread already says.
- Batch independent tool calls in one turn.
- Validate once before pushing (lint/tests on the changed area), not by repeated CI runs.
- Answer short. Long output goes in a file or a Drive doc, with a one-line pointer.
