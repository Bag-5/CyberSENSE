const URL_PATTERN = /https?:\/\/[^\s<>"']+/gi;
const DOMAIN_PATTERN = /[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?(?=\s|[.,;:!?)]|$)/gi;
const IP_PATTERN = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

function isValidIp(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  return parts.every((p) => p >= 0 && p <= 255);
}

export type ExtractedIndicators = {
  urls: string[];
  domains: string[];
  ips: string[];
};

export function extractIndicators(input: string): ExtractedIndicators {
  const urlSet = new Set<string>();
  const domainSet = new Set<string>();
  const ipSet = new Set<string>();

  const urls = input.match(URL_PATTERN) ?? [];
  for (const url of urls) {
    urlSet.add(url);
    try {
      const host = new URL(url).hostname.toLowerCase();
      if (host) domainSet.add(host);
    } catch {
    }
  }

  const ips = input.match(IP_PATTERN) ?? [];
  for (const ip of ips) {
    if (isValidIp(ip)) ipSet.add(ip);
  }

  const rawDomains = input.match(DOMAIN_PATTERN) ?? [];
  for (const d of rawDomains) {
    const lower = d.toLowerCase();
    if (!urlSet.has(lower) && lower.split(".").length >= 2) {
      domainSet.add(lower);
    }
  }

  return {
    urls: [...urlSet],
    domains: [...domainSet].filter((d) => !d.startsWith("localhost") && !d.startsWith("127.")),
    ips: [...ipSet],
  };
}
