# Foundrr

**A local, single-machine command center for supervising AI coding agents from
anywhere** — paired with an anonymous global usage leaderboard at
[foundrr.online](https://foundrr.online).

A Node/TypeScript daemon runs on your dev box and serves a dashboard. A
zero-dependency hook bridge observes your agents (Claude Code, and any agent you
drive through the terminal) and feeds the daemon events. The point isn't
observation — that's a crowded space. The point is **the leash**: when you're
away, the machine reaches *you* over Telegram and lets you **approve or deny a
permission prompt with one tap**.

Single user. One access token. Local SQLite. Binds `127.0.0.1` by default.

---

## What you get

### The dashboard — four surfaces

- **Agents** — every coding-agent session running right now: project, current
  activity, files edited, commands run, recent achievements. Live entities carry
  a breathing amber pulse.
- **Servers** — every dev server listening on the machine, with framework
  detection and **Open / Stop / Start / Restart**. Stop works on any detected
  process; Start/Restart work on **registered** servers (name + cwd + command,
  persisted to SQLite).
- **Terminal** — a real `claude` CLI in a PTY, streamed to the browser.
  Multi-tab, mobile-keyboard friendly, with scrollback replay on reconnect so a
  phone resuming mid-task picks up where it left off.
- **Cost meter** — a live `$ today / $ session` readout fed by Claude Code's
  OpenTelemetry metrics, updating within ~10s of activity.

### The leash — remote approve (the crown jewel)

When a gated tool call fires and you're away, your phone buzzes over the shared
Telegram bot **@foundrremotebot** with the command and **Approve / Deny**
buttons. A tap decides whether the agent proceeds. The default policy gates every
Bash command and every file-write tool (Write / Edit / MultiEdit / NotebookEdit);
reads are never gated. **On timeout (~50s)** the hook falls back to the normal
local permission prompt — it never hangs and never silently allows. One shared
bot serves every install: no BotFather, no token to manage.

### The leaderboard

Anonymous, opt-out usage telemetry rolls up into a global leaderboard at
[foundrr.online](https://foundrr.online) — see which agents/models the community
runs and how much they burn. Only an install id + your chosen model + token/cost
deltas are shared. **Never code, paths, or prompts.**

---

## Quick Start

Requirements: **Node ≥ 20** and **`claude` on your PATH** (needed for the
Terminal's **+ Claude** action).

Run these from the repo root, in order. Each command is on its own line, and any
`#` comment is on its own line too — never paste a comment trailing a command,
because some shells run the trailing comment as an argument.

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
- `mc setup` — install the Claude Code hooks, write your access token, enable
  token recording in `~/.claude/settings.json`, and print the dashboard URL.
- `mc start` — start the daemon, then open the printed
  `http://127.0.0.1:7878/?token=…` URL.

**Restart Claude Code after `mc setup`** so the telemetry env it writes into
`~/.claude/settings.json` takes effect — that's what powers the live cost/token
meter. `mc setup` is idempotent and safe to re-run; it backs up your
`~/.claude/settings.json` before merging.

### If `npm link` fails on macOS

`npm link` may need write access to the global npm prefix. Either:

```bash
sudo npm link
```

or set a user-owned npm prefix once, then re-run `npm link`:

```bash
npm config set prefix ~/.npm-global
```

After setting the prefix, make sure `~/.npm-global/bin` is on your PATH.

### Not linking `mc` globally?

Every command also works through the compiled CLI:

```bash
node packages/daemon/dist/cli/index.js setup
```

Replace `setup` with any subcommand (`start`, `doctor`, `telegram link`, …).

### Link the leash

```bash
mc telegram link
```

`mc telegram link` prints a one-time code. Open Telegram, message
**@foundrremotebot**, and send:

```
/link <CODE>
```

---

## Setting up with your AI agent

Foundrr ships a tailored, self-contained setup guide at the convention path each
agent auto-reads, so any agent can install it without extra prompting:

| Agent | File |
| --- | --- |
| Claude Code | [`CLAUDE.md`](./CLAUDE.md) |
| OpenAI Codex / ChatGPT agents | [`AGENTS.md`](./AGENTS.md) |
| Gemini CLI | [`GEMINI.md`](./GEMINI.md) |
| Cursor | [`.cursor/rules/foundrr.mdc`](./.cursor/rules/foundrr.mdc) |
| GitHub Copilot | [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) |
| Windsurf | [`.windsurfrules`](./.windsurfrules) |
| Aider | [`CONVENTIONS.md`](./CONVENTIONS.md) |

Open the repo in your agent and ask it to "set up Foundrr" — it reads its own
file and runs the steps.

---

## Command reference

| Command | What it does |
| --- | --- |
| `mc setup` | Guided first-run: token + hooks + telemetry env + dashboard URL (idempotent) |
| `mc start` | Start the daemon and print the dashboard URL |
| `mc doctor` | Environment preflight checklist (Node, `claude`, token, hooks, telemetry env, web build) |
| `mc telegram link` | Get a one-time code to link this install to the shared bot **@foundrremotebot** |
| `mc telegram status` | Show the Telegram mode, install id, and linked state |
| `mc config model <key>` | Set the agent/model you run (the leaderboard bucket); `mc config model show` lists keys |
| `mc telemetry share off` | Opt out of anonymous usage sharing (`on` to re-enable, `status` to check) |
| `mc telemetry enable --write` | Re-apply the OTel env block into `~/.claude/settings.json` |
| `mc rotate-token` | Regenerate the access token (revokes the old URL) and print the new URL |
| `mc tunnel [--yes]` | Expose the dashboard at a public Cloudflare HTTPS URL (exposes a shell — read the warning) |

---

## Access from anywhere

The daemon binds `127.0.0.1` by default. For remote access, prefer **Tailscale**
(private, encrypted, works over cellular, no public URL):

1. Install Tailscale on the dev box and your phone (same tailnet).
2. Start the daemon so it accepts the tailnet interface:
   ```bash
   HOST=0.0.0.0 mc start
   ```
3. Open `http://<machine-name>:<PORT>/?token=…` from your phone (the machine name
   is its Tailscale name; the token is in the `mc start` banner or
   `~/.mission-control/token`).

A public Cloudflare quick tunnel is also available via `mc tunnel`, but it
exposes a token-gated shell to the internet — treat it as temporary, and run
`mc rotate-token` afterward if the URL may have leaked.

---

## Telemetry & privacy

Anonymous usage sharing is **on by default**. What's shared:

- An anonymous install id, your chosen model, and token/cost deltas.

What's **never** shared:

- Code, file paths, prompts, or any project content.

It powers the global leaderboard at [foundrr.online](https://foundrr.online). Opt
out any time:

```bash
mc telemetry share off
```

Separately, the **cost meter** relies on an OpenTelemetry env block that
`mc setup` writes into `~/.claude/settings.json` (backed up first). To re-apply
it by hand:

```bash
mc telemetry enable --write
```

---

## Security

- Binds **`127.0.0.1` by default** — local only.
- **A token guards every data route**, the WebSocket stream, and the hook ingest.
- A streamed shell is as powerful as physical access — treat it that way.
- The token rides in the dashboard URL (`?token=…`); the SPA strips it from the
  address bar after load, but it can still leak via history, a `Referer` header,
  or a screenshot. If a URL may have leaked, run `mc rotate-token` to revoke it.
