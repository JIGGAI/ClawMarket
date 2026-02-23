export type ParsedRecipeAgent = {
  role?: string;
  name?: string;
  agentId?: string;
};

export type ParsedRecipeCronJob = {
  id?: string;
  name?: string;
  schedule?: string;
  timezone?: string;
  message?: string;
  enabledByDefault?: boolean;
};

export type ParsedRecipeFrontmatter = {
  id?: string;
  name?: string;
  version?: string;
  kind?: string;
  agents?: ParsedRecipeAgent[];
  cronJobs?: ParsedRecipeCronJob[];
};

function stripQuotes(s: string) {
  const t = s.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

function parseScalar(raw: string): string | boolean {
  const v = stripQuotes(raw.trim());
  if (v === "true") return true;
  if (v === "false") return false;
  return v;
}

function extractFrontmatter(md: string): string | null {
  const text = md.replace(/^\uFEFF/, "");
  if (!text.startsWith("---\n") && !text.startsWith("---\r\n")) return null;

  const endIdx = text.indexOf("\n---", 4);
  if (endIdx === -1) return null;

  // Grab lines between the first and second ---
  const block = text.slice(4, endIdx).replace(/\r\n/g, "\n");
  return block;
}

function parseTopLevelScalars(block: string, keys: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  const lines = block.split("\n");
  for (const line of lines) {
    if (!line || /^\s/.test(line)) continue; // top-level only
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    const k = m[1];
    if (!keys.includes(k)) continue;
    out[k] = stripQuotes((m[2] ?? "").trim());
  }
  return out;
}

function parseListOfObjects(block: string, key: string): Array<Record<string, string | boolean>> {
  const lines = block.split("\n");
  const out: Array<Record<string, string | boolean>> = [];

  let inSection = false;
  let current: Record<string, string | boolean> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inSection) {
      if (line.match(new RegExp(`^${key}:\\s*$`))) {
        inSection = true;
      }
      continue;
    }

    // stop if we hit a new top-level key
    if (line && !/^\s/.test(line)) break;

    // Expect list items at 2-space indent: "  - ..."
    const item = line.match(/^\s{2}-\s*(.*)$/);
    if (item) {
      if (current) out.push(current);
      current = {};

      const inline = item[1]?.trim();
      // handle "- key: value" inline
      const kv = inline.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
      if (kv && current) {
        current[kv[1]] = parseScalar(kv[2] ?? "");
      }
      continue;
    }

    // Expect props at 4-space indent: "    key: value"
    const prop = line.match(/^\s{4}([A-Za-z0-9_]+):\s*(.*)$/);
    if (prop && current) {
      current[prop[1]] = parseScalar(prop[2] ?? "");
    }
  }

  if (current) out.push(current);
  return out;
}

export function parseRecipeFrontmatter(markdown: string): ParsedRecipeFrontmatter | null {
  const block = extractFrontmatter(markdown);
  if (!block) return null;

  const scalars = parseTopLevelScalars(block, ["id", "name", "version", "kind"]);

  const agentsRaw = parseListOfObjects(block, "agents");
  const cronRaw = parseListOfObjects(block, "cronJobs");

  const agents: ParsedRecipeAgent[] | undefined = agentsRaw.length
    ? agentsRaw.map((a) => ({
        role: typeof a.role === "string" ? a.role : undefined,
        name: typeof a.name === "string" ? a.name : undefined,
        agentId: typeof a.agentId === "string" ? a.agentId : undefined,
      }))
    : undefined;

  const cronJobs: ParsedRecipeCronJob[] | undefined = cronRaw.length
    ? cronRaw.map((c) => ({
        id: typeof c.id === "string" ? c.id : undefined,
        name: typeof c.name === "string" ? c.name : undefined,
        schedule: typeof c.schedule === "string" ? c.schedule : undefined,
        timezone: typeof c.timezone === "string" ? c.timezone : undefined,
        message: typeof c.message === "string" ? c.message : undefined,
        enabledByDefault: typeof c.enabledByDefault === "boolean" ? c.enabledByDefault : undefined,
      }))
    : undefined;

  return {
    id: scalars.id,
    name: scalars.name,
    version: scalars.version,
    kind: scalars.kind,
    agents,
    cronJobs,
  };
}
