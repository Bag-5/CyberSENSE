import type { VirusTotalFinding } from "@/types/ai";

const VT_API_BASE = "https://www.virustotal.com/api/v3";
const VT_TIMEOUT_MS = 8000;

function getApiKey(): string | null {
  return process.env.VIRUSTOTAL_API_KEY ?? null;
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function vtFetch(
  path: string,
  signal: AbortSignal,
): Promise<Record<string, unknown> | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  try {
    const response = await fetch(`${VT_API_BASE}${path}`, {
      headers: { "x-apikey": apiKey },
      signal,
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      if (response.status === 429) return null;
      console.warn("[virustotal] unexpected status", { path, status: response.status });
      return null;
    }

    return (await response.json()) as Record<string, unknown>;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.warn("[virustotal] request timed out", { path });
      return null;
    }
    console.warn("[virustotal] request failed", { path, error });
    return null;
  }
}

function parseStats(
  data: Record<string, unknown> | undefined,
): { malicious: number; total: number; suspicious: number } {
  const stats = (data?.attributes as Record<string, unknown> | undefined)
    ?.last_analysis_stats as Record<string, number> | undefined;

  if (!stats) return { malicious: 0, total: 0, suspicious: 0 };

  const malicious = stats.malicious ?? 0;
  const suspicious = stats.suspicious ?? 0;
  const harmless = stats.harmless ?? 0;
  const undetected = stats.undetected ?? 0;
  const total = malicious + suspicious + harmless + undetected;

  return { malicious, total, suspicious };
}

function parseCategories(
  data: Record<string, unknown> | undefined,
): string[] {
  const categories = (data?.attributes as Record<string, unknown> | undefined)
    ?.categories as Record<string, string> | undefined;

  if (!categories) return [];
  return [...new Set(Object.values(categories))].slice(0, 5);
}

async function checkUrl(
  url: string,
  signal: AbortSignal,
): Promise<VirusTotalFinding | null> {
  const urlId = base64UrlEncode(url);

  let data = await vtFetch(`/urls/${urlId}`, signal);

  if (!data) {
    const formBody = new URLSearchParams({ url }).toString();
    const apiKey = getApiKey();
    if (!apiKey) return null;

    try {
      const submitResponse = await fetch(`${VT_API_BASE}/urls`, {
        method: "POST",
        headers: {
          "x-apikey": apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody,
        signal,
      });

      if (!submitResponse.ok) return null;

      const submitResult = (await submitResponse.json()) as Record<string, unknown>;
      const analysisId = ((submitResult.data as Record<string, unknown> | undefined)
        ?.id as string) ?? "";

      if (!analysisId) return null;

      data = await vtFetch(`/analyses/${analysisId}`, signal);
      if (!data) return null;
    } catch {
      return null;
    }
  }

  const stats = parseStats(data);
  if (stats.total === 0) return null;

  const categories = parseCategories(data);

  return {
    type: "url",
    value: url.length > 80 ? url.slice(0, 77) + "..." : url,
    malicious: stats.malicious,
    suspicious: stats.suspicious,
    total: stats.total,
    categories,
  };
}

async function checkDomain(
  domain: string,
  signal: AbortSignal,
): Promise<VirusTotalFinding | null> {
  const data = await vtFetch(`/domains/${encodeURIComponent(domain)}`, signal);
  if (!data) return null;

  const stats = parseStats(data);
  if (stats.total === 0) return null;

  const categories = parseCategories(data);

  return {
    type: "domain",
    value: domain,
    malicious: stats.malicious,
    suspicious: stats.suspicious,
    total: stats.total,
    categories,
  };
}

async function checkIp(
  ip: string,
  signal: AbortSignal,
): Promise<VirusTotalFinding | null> {
  const data = await vtFetch(`/ip_addresses/${ip}`, signal);
  if (!data) return null;

  const stats = parseStats(data);
  if (stats.total === 0) return null;

  const country = ((data.data as Record<string, unknown> | undefined)
    ?.attributes as Record<string, unknown> | undefined)
    ?.country as string | undefined;

  return {
    type: "ip",
    value: ip,
    malicious: stats.malicious,
    suspicious: stats.suspicious,
    total: stats.total,
    categories: country ? [`Country: ${country}`] : [],
  };
}

export type VtCheckResult = {
  findings: VirusTotalFinding[];
  checked: boolean;
};

export async function checkIndicators(
  urls: string[],
  domains: string[],
  ips: string[],
): Promise<VtCheckResult> {
  const apiKey = getApiKey();
  if (!apiKey) return { findings: [], checked: false };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), VT_TIMEOUT_MS);

  try {
    const checks: Promise<VirusTotalFinding | null>[] = [];

    for (const url of urls) {
      checks.push(checkUrl(url, controller.signal));
    }
    for (const domain of domains) {
      checks.push(checkDomain(domain, controller.signal));
    }
    for (const ip of ips) {
      checks.push(checkIp(ip, controller.signal));
    }

    const results = await Promise.allSettled(checks);
    const findings = results
      .filter(
        (r): r is PromiseFulfilledResult<VirusTotalFinding> =>
          r.status === "fulfilled" && r.value !== null,
      )
      .map((r) => r.value);

    return { findings, checked: true };
  } finally {
    clearTimeout(timeout);
  }
}

export function formatVtIntel(findings: VirusTotalFinding[]): string {
  if (!findings.length) return "";

  const lines: string[] = ["--- THREAT INTELLIGENCE DATA ---"];

  for (const f of findings) {
    const label = f.type === "url" ? "URL" : f.type === "domain" ? "Domain" : "IP";
    lines.push(`[${label}] ${f.value}`);
    if (f.malicious > 0) {
      lines.push(`  → Flagged by ${f.malicious}/${f.total} security vendors`);
    }
    if (f.suspicious > 0) {
      lines.push(`  → Suspicious by ${f.suspicious}/${f.total} vendors`);
    }
    if (f.categories?.length) {
      lines.push(`  → Categories: ${f.categories.join(", ")}`);
    }
    if (f.malicious === 0 && f.suspicious === 0) {
      lines.push(`  → No detections (${f.total} vendors checked)`);
    }
    lines.push("");
  }

  lines.push("--- END THREAT INTELLIGENCE ---");
  return lines.join("\n");
}
