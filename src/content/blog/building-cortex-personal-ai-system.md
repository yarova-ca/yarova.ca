---
title: 'I Built a Personal AI System That Runs My DevOps Career'
description: 'How I created Cortex — a persistent, multi-machine AI memory system that eliminates friction in platform engineering work and compounds in value over years.'
pubDate: 'Apr 10 2026'
heroImage: ''
---

Six months ago, every time I started a new Claude Code session, I had to re-explain everything. My clusters. My apps. My playbooks. My preferences. Every. Single. Time.

That friction wasn't just annoying — it was costing me hours every week. As a Platform Engineer managing 14 apps across multiple OpenShift clusters, the context I carry in my head is enormous. And AI assistants, for all their power, have the memory of a goldfish.

So I built **Cortex**.

## What is Cortex?

Cortex is a persistent, multi-machine AI memory and automation system built entirely in plain markdown. It's my "second brain" — but instead of being a passive note-taking app, it actively powers my AI-assisted workflow.

Here's what it does:

- **Remembers everything**: cluster topologies, app architectures, shared service dependencies, Helm chart patterns, secret rotation schedules
- **Runs playbooks**: safe, repeatable procedures for common ops tasks (pod restarts, Helm upgrades, secret rotations, morning briefings)
- **Syncs across machines**: one `cortex sync` command pulls the latest knowledge to any machine
- **Survives tool changes**: it's just markdown files in a git repo — if Claude disappeared tomorrow, my knowledge stays

## The Architecture

```
cortex/
├── personal/         # portable across jobs
│   ├── reference/    # helm patterns, k8s fundamentals
│   ├── life/         # career, finance, health, learning
│   └── projects/     # homelab, brand building
│
└── clients/          # strictly isolated per employer
    └── bcgov/
        └── memory/   # 44 files, 3000+ lines of operational knowledge
```

The key insight: **strict client/personal separation**. My Helm patterns and career goals follow me everywhere. My employer's cluster details never leave their boundary. This makes the system safe to use long-term across multiple jobs.

## Real Impact

Before Cortex, a typical morning looked like this:

1. Open terminal
2. Try to remember which tickets I was working on
3. Re-explain my cluster setup to Claude
4. Figure out which environments need attention
5. Slowly get into flow

After Cortex:

1. Open terminal
2. `cortex sync`
3. "Run morning brief"
4. Claude reads my state files, checks Jira via MCP, scans clusters
5. I get a prioritized action list in 30 seconds

**That's a 50% reduction in daily startup friction.** Multiply that across weeks and months, and it compounds massively.

## The Playbook System

The most valuable part of Cortex isn't the memory — it's the playbooks. Each playbook encodes a safe, repeatable procedure:

- **Helm Upgrade Playbook**: template first, dry-run second, backup third, execute fourth. Never skip a step.
- **Secret Rotation Playbook**: extract → modify → re-encode → patch → verify. One wrong move could take down production.
- **Morning Brief Playbook**: pull Jira tickets, scan cluster health, check state files, prioritize the day.

These aren't just documentation. They're executable instructions that Claude follows step-by-step, with safety gates at each stage.

## Why Plain Markdown?

I've seen too many "second brain" tools come and go. Notion, Obsidian, Roam — they're all great until the company pivots, raises prices, or shuts down.

Cortex is built on three things that will never disappear:
1. **Git** — version control that's been stable for 20 years
2. **Markdown** — readable by humans and every AI model
3. **The filesystem** — the most universal interface

No vendor lock-in. No proprietary formats. No subscriptions. Just files.

## The Bootstrap Problem

The hardest part wasn't building Cortex — it was making it frictionless. If syncing your memory requires 5 manual steps, you'll stop doing it within a week.

The solution: a single `cortex sync` command that:
1. Pulls the latest from git
2. Re-runs the bootstrap
3. Copies memory files to the right locations
4. Renders config templates with machine-specific paths
5. Configures Claude Desktop with MCP servers

One command. Zero thinking. That's the bar.

## What's Next

Cortex is one week old and already handling my daily DevOps workflow. The roadmap:

- **Month 1**: All five core playbooks battle-tested on real work
- **Month 2**: Gmail and Calendar integration (morning brief pulls calendar too)
- **Month 3**: Content drafting pipeline (this blog post was drafted with Cortex)
- **Year 1**: Full personal brand automation — blog, newsletter, social media
- **Year 2**: Mobile access, voice interaction, always-on assistant

The substrate is built. Now it compounds.

## Try It Yourself

You don't need to build something as elaborate as Cortex. Start with one thing:

**Create a `MEMORY.md` file in your project directory.** List the 10 things you re-explain to your AI assistant every session. That alone will save you hours.

Then build from there. Add playbooks. Add state files. Add a sync command. Let it grow organically.

The best system is the one you actually use. Start small, compound daily.

---

*Rohith Yadla is a Platform Engineer building at the intersection of infrastructure and AI. Follow the journey at [yarova.ca](https://yarova.ca).*
