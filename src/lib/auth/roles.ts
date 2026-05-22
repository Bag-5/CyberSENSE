import type { AuthRole } from "@/lib/auth/types";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function parseAllowlist(value: string | undefined) {
  return (value || "")
    .split(",")
    .map((entry) => normalizeEmail(entry))
    .filter(Boolean);
}

export function isAllowlistedEmail(email: string, allowlist: string | undefined) {
  return parseAllowlist(allowlist).includes(normalizeEmail(email));
}

export function resolveAuthRole(email: string): AuthRole {
  if (isAllowlistedEmail(email, process.env.CYBERSENSE_SUPERADMIN_EMAILS)) {
    return "superadmin";
  }

  if (isAllowlistedEmail(email, process.env.CYBERSENSE_ADMIN_EMAILS)) {
    return "admin";
  }

  return "user";
}
