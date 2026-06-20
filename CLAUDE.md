# Foundrr — setup guide for Claude Code

Foundrr is a **local, single-machine command center** for supervising AI coding
agents (Claude Code, Codex, Gemini, and more) from anywhere. A Node/TypeScript
daemon runs on the dev box and serves a dashboard — **Agents**, **Servers**, a
real `claude` **Terminal**, and a live **cost/token meter**. A zero-dependency
hook bridge observes Claude Code and feeds the daemon events. The crown jewel is
the **leash**: when you're away, your machine reaches you over the shared
Telegram bot **@foundrremotebot** so you can **approve or deny Claude Code's
permission prompts with one tap**. There's also an anonymous global usage
leaderboard at **foundrr.online**.

Single user. One access token. Local SQLite. Binds `127.0.0.1` by default.

---

## Setup (run these in order, from the repo root)

Each command is on its own line. Comments are on their own lines too — never
paste a `#` comment onto the same line as a command, because some shells will run
the trailing comment as an argument.

```bash
npm install
npm run build
npm link
mc setup
mc start
```

What each step does:

- `npm install` — install workspace dependencies.
- `npm run build` — compile every package (shared, hook, web, daemon).
- `npm link` — put the `mc` command on your PATH.
- `mc setup` — install the Claude Code hooks, write the access token, enable
  token recording in `~/.claude/settings.json`, and print the dashboard URL.
- `mc start` — start the daemon, then open the printed
  `http://127.0.0.1:7878/?token=…` URL in your browser.

`mc setup` is idempotent — safe to re-run. It backs up `~/.claude/settings.json`
before merging, so it never clobbers your existing config.

### If `npm link` fails on macOS

`npm link` may need write access to the global npm prefix. Two safe options:

```bash
sudo npm link
```

or set a user-owned npm prefix once, then re-run `npm link`:

```bash
npm config set prefix ~/.npm-global
```

After setting the prefix, make sure `~/.npm-global/bin` is on your PATH.

---

## Restart the agent after `mc setup`

After `mc setup`, **restart Claude Code** so the telemetry env it wrote into
`~/.claude/settings.json` takes effect. That env block is what powers the live
cost/token meter in the dashboard.

---

## Link the leash (Telegram remote-approve)

```bash
mc telegram link
```

`mc telegram link` prints a one-time code. Open Telegram, message
**@foundrremotebot**, and send:

```
/link <CODE>
```

One shared bot serves every install — no BotFather, no bot token to manage. Once
linked, gated tool calls (Bash, file writes) buzz your phone with **Approve /
Deny** buttons. On timeout (~50s) it falls back to the normal local prompt — it
never hangs and never silently allows.

---

## If `mc` isn't on your PATH

Every command also works through the compiled CLI directly:

```bash
node packages/daemon/dist/cli/index.js setup
```

```bash
node packages/daemon/dist/cli/index.js start
```

Replace `setup` / `start` with any subcommand (`doctor`, `telegram link`, etc.).

---

## Useful commands

- `mc doctor` — preflight checklist (Node, `claude` on PATH, token, hooks,
  telemetry env, web build).
- `mc config model <key>` — set the agent/model you run (the leaderboard bucket).
  See keys with `mc config model show`.
- `mc telemetry share off` — opt out of anonymous usage sharing.
- `mc rotate-token` — revoke a leaked dashboard URL and print a fresh one.

Telemetry is **anonymous and on by default** (install id + model + token/cost
deltas; never code, paths, or prompts).

Binds `127.0.0.1` by default. For LAN / Tailscale access, start with
`HOST=0.0.0.0 mc start`. `PORT` defaults to `7878`.

---

## For the agent

If the user asks to set up or run Foundrr, execute the **Setup** steps above in
order. After `mc setup`, remind them to **restart Claude Code** so telemetry
applies, then run `mc start` and open the printed `?token=` URL. If `npm link`
fails, fall back to `sudo npm link` or a user npm prefix, or use the
`node packages/daemon/dist/cli/index.js <cmd>` form. Offer the Telegram leash
(`mc telegram link` → `/link <CODE>` to **@foundrremotebot**) as the next step.
