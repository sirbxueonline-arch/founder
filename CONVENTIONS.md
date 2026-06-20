# Foundrr — setup guide for Aider

Aider reads a conventions file you pass with `--read CONVENTIONS.md` (or list it
under `read:` in `.aider.conf.yml`) so it stays in context for the whole session.
This file tells you how to set up **Foundrr**.

## What Foundrr is

Foundrr is a **local, single-machine command center** for supervising AI coding
agents (Claude Code, Codex, Gemini, and more) from anywhere. A Node/TypeScript
daemon serves a dashboard:

- **Agents** — live coding-agent sessions.
- **Servers** — dev servers on the machine, with Open / Stop / Start / Restart.
- **Terminal** — a real `claude` CLI streamed to the browser, mobile-friendly.
- **Cost meter** — live `$ today / $ session` from OpenTelemetry.

The crown jewel is the **leash**: when you're away, the machine reaches you over
the shared Telegram bot **@foundrremotebot** so you can **approve or deny
permission prompts with one tap**. Anonymous global usage leaderboard at
**foundrr.online**. Single user, one access token, local SQLite, binds
`127.0.0.1` by default.

## Setup

Run from the repo root, in order. Keep each command on its own line, and keep any
`#` comment on its own line — never trailing a command, because some shells run a
trailing comment as an argument.

```bash
npm install
npm run build
npm link
mc setup
mc start
```

- `npm install` — install workspace dependencies.
- `npm run build` — compile every package (shared, hook, web, daemon).
- `npm link` — put the `mc` command on your PATH.
- `mc setup` — install hooks, write the access token, enable token recording in
  `~/.claude/settings.json`, and print the dashboard URL. Idempotent; backs up
  settings before merging.
- `mc start` — start the daemon, then open the printed
  `http://127.0.0.1:7878/?token=…` URL.

### If `npm link` needs elevated permissions on macOS

```bash
sudo npm link
```

Or set a user-owned npm prefix once, then re-run `npm link`:

```bash
npm config set prefix ~/.npm-global
```

Ensure `~/.npm-global/bin` is on your PATH afterward.

## After `mc setup`

**Restart Claude Code (or your agent)** so the telemetry env written into
`~/.claude/settings.json` takes effect — it powers the live cost/token meter.

## Link the leash (Telegram remote-approve)

```bash
mc telegram link
```

Prints a one-time code. Open Telegram, message **@foundrremotebot**, and send:

```
/link <CODE>
```

One shared bot serves every install — no BotFather, no token.

## If `mc` isn't on your PATH

```bash
node packages/daemon/dist/cli/index.js setup
```

```bash
node packages/daemon/dist/cli/index.js start
```

Swap `setup` / `start` for any subcommand (`doctor`, `telegram link`, etc.).

## Handy commands

- `mc doctor` — environment preflight checklist.
- `mc config model <key>` — set the agent/model (`mc config model show` lists
  keys); this is the leaderboard bucket.
- `mc telemetry share off` — opt out of anonymous usage sharing (on by default;
  install id + model + token/cost deltas only, never code/paths/prompts).
- `mc rotate-token` — revoke a leaked dashboard URL and print a fresh one.

Binds `127.0.0.1` by default. For LAN / Tailscale, start with
`HOST=0.0.0.0 mc start`. `PORT` defaults to `7878`.
