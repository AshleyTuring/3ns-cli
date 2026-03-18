import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const RC_PATH = path.join(os.homedir(), ".3nsrc");
const DEFAULT_BASE_URL = "https://us-central1-web3ns-e4199.cloudfunctions.net/openclaw/openclaw";

interface Config {
  apiKey: string;
  baseUrl?: string;
}

export function loadConfig(): Config | null {
  try {
    if (!fs.existsSync(RC_PATH)) return null;
    const raw = fs.readFileSync(RC_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveConfig(config: Config): void {
  fs.writeFileSync(RC_PATH, JSON.stringify(config, null, 2), "utf8");
  fs.chmodSync(RC_PATH, 0o600);
}

export function getApiKey(): string {
  const config = loadConfig();
  if (!config?.apiKey) {
    console.error("Not authenticated. Run: 3ns auth login");
    process.exit(1);
  }
  return config.apiKey;
}

export function getBaseUrl(): string {
  const config = loadConfig();
  return config?.baseUrl || DEFAULT_BASE_URL;
}

export async function api<T = any>(
  method: string,
  endpoint: string,
  body?: any
): Promise<{ status: number; data: T }> {
  const apiKey = getApiKey();
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  };

  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = (data as any)?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return { status: res.status, data: data as T };
}

export function printJson(data: any): void {
  console.log(JSON.stringify(data, null, 2));
}

export function printTable(rows: Record<string, any>[], columns?: string[]): void {
  if (rows.length === 0) {
    console.log("(no results)");
    return;
  }
  const cols = columns || Object.keys(rows[0]);
  const widths = cols.map((c) =>
    Math.max(c.length, ...rows.map((r) => String(r[c] ?? "").length))
  );
  const header = cols.map((c, i) => c.padEnd(widths[i])).join("  ");
  const sep = widths.map((w) => "-".repeat(w)).join("  ");
  console.log(header);
  console.log(sep);
  for (const row of rows) {
    console.log(cols.map((c, i) => String(row[c] ?? "").padEnd(widths[i])).join("  "));
  }
}
