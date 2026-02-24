import YAML from "yaml";

export type ParsedRecipeTools = {
  profile?: string;
  allow?: string[];
  deny?: string[];
};

export type ParsedRecipeAgent = {
  role?: string;
  name?: string;
  agentId?: string;
  tools?: ParsedRecipeTools;
};

export type ParsedRecipeCronJob = {
  id?: string;
  name?: string;
  schedule?: string;
  timezone?: string;
  message?: string;
  enabledByDefault?: boolean;
  agentId?: string;
  channel?: string;
};

export type ParsedRecipeFile = {
  path?: string;
  template?: string;
  mode?: string;
};

export type ParsedRecipeFrontmatter = {
  id?: string;
  name?: string;
  version?: string;
  kind?: string;
  description?: string;
  teamId?: string;
  agents?: ParsedRecipeAgent[];
  cronJobs?: ParsedRecipeCronJob[];
  files?: ParsedRecipeFile[];
};

function extractFrontmatterBlock(md: string): string | null {
  const text = md.replace(/^\uFEFF/, "");
  if (!text.startsWith("---\n") && !text.startsWith("---\r\n")) return null;

  // Find the closing delimiter at the start of a line.
  const m = text.match(/\n---\s*\n/);
  if (!m || m.index == null) return null;

  const start = 4; // after first "---\n"
  const end = m.index;
  return text.slice(start, end).replace(/\r\n/g, "\n");
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function asStringArray(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v.filter((x) => typeof x === "string") as string[];
  return out.length ? out : undefined;
}

function asBoolean(v: unknown): boolean | undefined {
  return typeof v === "boolean" ? v : undefined;
}

export function parseRecipeFrontmatter(markdown: string): ParsedRecipeFrontmatter | null {
  const block = extractFrontmatterBlock(markdown);
  if (!block) return null;

  let doc: unknown;
  try {
    doc = YAML.parse(block);
  } catch {
    return null;
  }

  if (!doc || typeof doc !== "object") return null;
  const obj = doc as Record<string, unknown>;

  const team = (obj.team && typeof obj.team === "object" ? (obj.team as Record<string, unknown>) : null) ?? null;

  const agentsRaw = Array.isArray(obj.agents) ? (obj.agents as unknown[]) : [];
  const agents: ParsedRecipeAgent[] | undefined = agentsRaw.length
    ? agentsRaw
        .map((a) => {
          if (!a || typeof a !== "object") return null;
          const ao = a as Record<string, unknown>;
          const toolsRaw = ao.tools && typeof ao.tools === "object" ? (ao.tools as Record<string, unknown>) : null;
          const tools: ParsedRecipeTools | undefined = toolsRaw
            ? {
                profile: asString(toolsRaw.profile),
                allow: asStringArray(toolsRaw.allow),
                deny: asStringArray(toolsRaw.deny),
              }
            : undefined;

          return {
            role: asString(ao.role),
            name: asString(ao.name),
            agentId: asString(ao.agentId),
            tools,
          } as ParsedRecipeAgent;
        })
        .filter(Boolean) as ParsedRecipeAgent[]
    : undefined;

  const cronRaw = Array.isArray(obj.cronJobs) ? (obj.cronJobs as unknown[]) : [];
  const cronJobs: ParsedRecipeCronJob[] | undefined = cronRaw.length
    ? cronRaw
        .map((c) => {
          if (!c || typeof c !== "object") return null;
          const co = c as Record<string, unknown>;
          return {
            id: asString(co.id),
            name: asString(co.name),
            schedule: asString(co.schedule),
            timezone: asString(co.timezone),
            message: asString(co.message),
            enabledByDefault: asBoolean(co.enabledByDefault),
            agentId: asString(co.agentId),
            channel: asString(co.channel),
          } as ParsedRecipeCronJob;
        })
        .filter(Boolean) as ParsedRecipeCronJob[]
    : undefined;

  const filesRaw = Array.isArray(obj.files) ? (obj.files as unknown[]) : [];
  const files: ParsedRecipeFile[] | undefined = filesRaw.length
    ? filesRaw
        .map((f) => {
          if (!f || typeof f !== "object") return null;
          const fo = f as Record<string, unknown>;
          return {
            path: asString(fo.path),
            template: asString(fo.template),
            mode: asString(fo.mode),
          } as ParsedRecipeFile;
        })
        .filter(Boolean) as ParsedRecipeFile[]
    : undefined;

  return {
    id: asString(obj.id),
    name: asString(obj.name),
    version: asString(obj.version),
    kind: asString(obj.kind),
    description: asString(obj.description),
    teamId: asString(team?.teamId),
    agents,
    cronJobs,
    files,
  };
}
