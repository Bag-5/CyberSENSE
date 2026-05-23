"use client";

import type { PublicSessionUser } from "@/lib/auth/types";
import type { AuthPortal } from "@/lib/auth/constants";

const authStorageKeys: Record<AuthPortal, string> = {
  user: "cybersense.session.user",
  superadmin: "cybersense.superadmin.session.user",
};

const authEventNames: Record<AuthPortal, string> = {
  user: "cybersense:auth-changed",
  superadmin: "cybersense:superadmin-auth-changed",
};

const authChannelNames: Record<AuthPortal, string> = {
  user: "cybersense-auth-channel",
  superadmin: "cybersense-superadmin-auth-channel",
};

type AuthMessage = {
  type: "auth-changed";
};

function resolveAuthKey(portal: AuthPortal) {
  return authStorageKeys[portal];
}

function resolveEventName(portal: AuthPortal) {
  return authEventNames[portal];
}

function resolveChannelName(portal: AuthPortal) {
  return authChannelNames[portal];
}

function safeParse(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as PublicSessionUser;
    if (
      !parsed ||
      typeof parsed.id !== "string" ||
      typeof parsed.username !== "string" ||
      typeof parsed.email !== "string" ||
      (parsed.role !== "user" && parsed.role !== "admin" && parsed.role !== "superadmin")
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function readStoredSessionUser(portal: AuthPortal = "user") {
  if (typeof window === "undefined") {
    return null;
  }

  const parsed = safeParse(window.localStorage.getItem(resolveAuthKey(portal)));
  if (!parsed) {
    return null;
  }

  if (portal === "superadmin" && parsed.role !== "superadmin") {
    return null;
  }

  if (portal === "user" && parsed.role === "superadmin") {
    return null;
  }

  return parsed;
}

export function writeStoredSessionUser(user: PublicSessionUser, portal: AuthPortal = "user") {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(resolveAuthKey(portal), JSON.stringify(user));
}

export function clearStoredSessionUser(portal: AuthPortal = "user") {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(resolveAuthKey(portal));
}

export function notifyAuthSessionChanged(portal: AuthPortal = "user") {
  if (typeof window === "undefined") {
    return;
  }

  const eventName = resolveEventName(portal);
  window.dispatchEvent(new Event(eventName));

  try {
    const channel = new BroadcastChannel(resolveChannelName(portal));
    channel.postMessage({ type: "auth-changed" } satisfies AuthMessage);
    channel.close();
  } catch {
    // BroadcastChannel is not available everywhere. The storage event still helps cross-tab sync.
  }

  window.localStorage.setItem(`cybersense.auth.signal.${portal}`, String(Date.now()));
}

export function subscribeToAuthSessionChanges(
  onChange: () => void,
  portal: AuthPortal = "user",
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (
      event.key === `cybersense.auth.signal.${portal}` ||
      event.key === resolveAuthKey(portal)
    ) {
      onChange();
    }
  };

  const handleEvent = () => onChange();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(resolveEventName(portal), handleEvent);

  let channel: BroadcastChannel | null = null;
  try {
    channel = new BroadcastChannel(resolveChannelName(portal));
    channel.addEventListener("message", () => onChange());
  } catch {
    channel = null;
  }

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(resolveEventName(portal), handleEvent);
    channel?.close();
  };
}
