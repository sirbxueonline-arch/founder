# Foundrr — setup guide for Codex and AGENTS.md-aware agents

This file follows the [AGENTS.md](https://agents.md) convention and is
auto-discovered by OpenAI Codex, ChatGPT-based coding agents, and other tools
that read `AGENTS.md`. It tells you how to set up **Foundrr** in this repo.

## What Foundrr is

Foundrr is a **local, single-machine command center** for supervising AI coding
agents (Claude Code, Codex, Gemini, and more) from anywhere. A Node/TypeScript
daemon runs on the dev box and serves a dashboard with four surfaces:

- **Agents** — every coding-agent session running right now.
- **Servers** — every dev server on the machine, with Open / Stop / Start /
  Restart.
- **Terminal** — a real `claude` CLI streamed to the browser (mobile-friendly).
- **Cost meter** — live `$ today / $ session` from OpenTelemetry.

The crown jewel is the **leash**: when you're away, the machine reaches you over
the shared Telegram bot **@foundrremotebot** so you can **approve or deny
permission prompts with one tap**. An anonymous global usage leaderboard lives at
**foundrr.online**.

Single user. One access token. Local SQLite. Binds `127.0.0.1` by default.

## Setup

Run these from the repo root, in order. Keep each command on its own line, and
keep any `#` comment on its own line — never trailing a command, since some
shells execute a trailing comment as an argument.

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
  `~/.claude/settings.json`, and print the dashboard URL. Idempotent and backs up
  settings before merging.
- `mc start` — start the daemon, then open the printed
  `http://127.0.0.1:7878/?token=…` URL.

### If `npm link` needs elevated permissions on macOS

```bash
sudo npm link
```

Or use a user-owned npm prefix once, then re-run `npm link`:

```bash
npm config set prefix ~/.npm-global
```

Ensure `~/.npm-global/bin` is on your PATH afterward.

## Restart the agent after `mc setup`

After `mc setup`, **restart your coding agent / Claude Code** so the telemetry
env written into `~/.claude/settings.json` takes effect. That env block powers
the live cost/token meter.

## Link the leash (Telegram remote-approve)

```bash
mc telegram link
```

This prints a one-time code. Open Telegram, message **@foundrremotebot**, and
send:

```
/link <CODE>
```

One shared bot serves every install — no BotFather, no token. Gated tool calls
then buzz your phone with **Approve / Deny**; on timeout (~50s) it falls back to
the local prompt.

## If `mc` isn't on your PATH

Use the compiled CLI directly:

```bash
node packages/daemon/dist/cli/index.js setup
```

```bash
node packages/daemon/dist/cli/index.js start
```

Swap `setup` / `start` for any subcommand (`doctor`, `telegram link`, etc.).

## Handy commands

- `mc doctor` — environment preflight checklist.
- `mc config model <key>` — set the agent/model you run (`mc config model show`
  lists keys). This is the leaderboard bucket.
- `mc telemetry share off` — opt out of anonymous usage sharing (on by default;
  install id + model + token/cost deltas only, never code/paths/prompts).
- `mc rotate-token` — revoke a leaked dashboard URL and print a fresh one.

Binds `127.0.0.1` by default. For LAN / Tailscale, start with
`HOST=0.0.0.0 mc start`. `PORT` defaults to `7878`.
