export type AuthPortal = "user" | "superadmin";

export const sessionCookieName = "cybersense_session";
export const superAdminSessionCookieName = "cybersense_superadmin_session";

export function getSessionCookieName(portal: AuthPortal = "user") {
  return portal === "superadmin" ? superAdminSessionCookieName : sessionCookieName;
}

export function getSessionCookiePath(_portal: AuthPortal = "user") {
  return _portal === "superadmin" ? "/" : "/";
}
