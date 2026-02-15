#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const OUT_DIR = path.resolve("public/get-started");

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { encoding: "utf8", ...opts });
  return {
    status: res.status ?? 0,
    stdout: String(res.stdout ?? ""),
    stderr: String(res.stderr ?? ""),
  };
}

function sanitize(text) {
  return String(text)
    .replaceAll("/home/control", "/home/you")
    .replaceAll("~/.openclaw", "~/.openclaw")
    .replaceAll("workspace-development-team", "workspace-your-team")
    .replace(/OpenClaw\s+\d{4}\.\d+\.\d+\s+\([0-9a-f]+\)/g, "OpenClaw <version>")
    .replace(/Created:\s*\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z/g, "Created: <timestamp>")
    .trimEnd();
}

function esc(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toSvg({ title, command, body }) {
  const width = 1100;
  const padding = 28;
  const fontSize = 16;
  const lineHeight = 22;
  const lines = (body || "").split("\n");
  const chromeH = 44;
  const innerTop = padding + chromeH;
  const contentH = Math.max(5, lines.length) * lineHeight;
  const height = innerTop + contentH + padding;

  const codeX = padding;
  const codeY = innerTop;

  const rendered = lines
    .map((line, i) => {
      const y = codeY + i * lineHeight;
      return `<text x="${codeX}" y="${y}" fill="#e2e8f0">${esc(line)}</text>`;
    })
    .join("\n");

  const cmdLine = `$ ${command}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#0b1220" />
      <stop offset="1" stop-color="#0a0f1a" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <rect x="0" y="0" width="${width}" height="${height}" fill="#0f172a"/>

  <g filter="url(#shadow)">
    <rect x="18" y="18" rx="18" ry="18" width="${width - 36}" height="${height - 36}" fill="url(#bg)" stroke="#1f2a44" stroke-width="1"/>

    <!-- chrome -->
    <g transform="translate(${padding}, ${padding})">
      <circle cx="12" cy="14" r="6" fill="#ef4444" />
      <circle cx="32" cy="14" r="6" fill="#f59e0b" />
      <circle cx="52" cy="14" r="6" fill="#22c55e" />
      <text x="88" y="18" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" font-size="13" fill="#94a3b8">${esc(title)}</text>
    </g>

    <!-- command line -->
    <text x="${padding}" y="${padding + chromeH - 6}" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" font-size="${fontSize}" fill="#34d399">${esc(cmdLine)}</text>

    <!-- output -->
    <g transform="translate(${padding}, ${padding + chromeH + 22})" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" font-size="${fontSize}" dominant-baseline="hanging">
${rendered}
    </g>
  </g>
</svg>`;
}

async function writeSvg(name, svg) {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const p = path.join(OUT_DIR, `${name}.svg`);
  await fs.writeFile(p, svg, "utf8");
  return p;
}

async function main() {
  const shots = [];

  // 1) plugins install
  {
    const cmd = "openclaw";
    const args = ["plugins", "install", "@jiggai/recipes"]; // may be no-op if already installed; still real output
    const r = run(cmd, args);
    const body = sanitize((r.stdout + "\n" + r.stderr).trim());
    shots.push({ name: "plugins-install", title: "Install recipes plugin", command: `${cmd} ${args.join(" ")}`, body });
  }

  // 2) gateway restart
  {
    const cmd = "openclaw";
    const args = ["gateway", "restart"];
    const r = run(cmd, args);
    const body = sanitize((r.stdout + "\n" + r.stderr).trim() || "(gateway restarted)");
    shots.push({ name: "gateway-restart", title: "Restart OpenClaw gateway", command: `${cmd} ${args.join(" ")}`, body });
  }

  // 3) plugins list
  {
    const cmd = "openclaw";
    const args = ["plugins", "list"];
    const r = run(cmd, args);
    const body = sanitize((r.stdout + "\n" + r.stderr).trim());
    shots.push({ name: "plugins-list", title: "List installed plugins", command: `${cmd} ${args.join(" ")}`, body });
  }

  // 4) recipes list
  {
    const cmd = "openclaw";
    const args = ["recipes", "list"];
    const r = run(cmd, args);
    const body = sanitize((r.stdout + "\n" + r.stderr).trim());
    shots.push({ name: "recipes-list", title: "List available recipes", command: `${cmd} ${args.join(" ")}`, body });
  }

  // 5) scaffold-team success
  {
    const cmd = "openclaw";
    const teamId = "docs-screenshot-team";
    const args = ["recipes", "scaffold-team", "development-team", "-t", teamId, "--overwrite"];
    const r = run(cmd, args);
    // Trim output: it's large JSON; keep top part.
    const full = sanitize((r.stdout + "\n" + r.stderr).trim());
    const body = full.split("\n").slice(0, 32).join("\n") + "\n…";
    shots.push({ name: "scaffold-team", title: "Scaffold a team", command: `${cmd} ${args.join(" ")}`, body });
  }

  // 6) missing skills message (create a temporary workspace recipe that requires a missing skill)
  {
    const ws = run("openclaw", ["config", "get", "agents.defaults.workspace"]).stdout.trim();
    if (ws) {
      const recipeDir = path.join(ws, "recipes");
      const recipeId = "docs-missing-skills-team";
      const recipePath = path.join(recipeDir, `${recipeId}.md`);
      const md = `---\nid: ${recipeId}\nname: Docs Missing Skills Team\nkind: team\nrequiredSkills:\n  - totally-not-a-skill\nagents:\n  - role: lead\n    name: Docs Lead\n---\n\n# Docs Missing Skills\n`;
      await fs.mkdir(recipeDir, { recursive: true });
      await fs.writeFile(recipePath, md, "utf8");

      const cmd = "openclaw";
      const args = ["recipes", "scaffold-team", recipeId, "-t", "docs-missing-skills-team", "--overwrite"];
      const r = run(cmd, args);
      const body = sanitize((r.stdout + "\n" + r.stderr).trim());
      shots.push({ name: "missing-skills", title: "Missing required skills", command: `${cmd} ${args.join(" ")}`, body });

      // cleanup recipe file
      await fs.rm(recipePath, { force: true });
    }
  }

  // 7) remove-team (help output is stable and safe)
  {
    const cmd = "openclaw";
    const args = ["recipes", "remove-team", "--help"];
    const r = run(cmd, args);
    const body = sanitize((r.stdout + "\n" + r.stderr).trim());
    shots.push({ name: "remove-team", title: "Remove a team", command: `${cmd} ${args.join(" ")}`, body });
  }

  // 8) upgrade steps (plugins update)
  {
    const cmd = "openclaw";
    const args = ["plugins", "update", "recipes"];
    const r = run(cmd, args);
    const body = sanitize((r.stdout + "\n" + r.stderr).trim());
    shots.push({ name: "upgrade", title: "Upgrade the plugin", command: `${cmd} ${args.join(" ")}`, body });
  }

  const written = [];
  for (const s of shots) {
    const svg = toSvg({ title: s.title, command: s.command, body: s.body || "" });
    written.push(await writeSvg(s.name, svg));
  }

  console.log(`[gen] wrote ${written.length} screenshots to ${OUT_DIR}`);
  for (const p of written) console.log(`- ${p}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
