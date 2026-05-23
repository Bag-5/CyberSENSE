"use client";

import type { PublicSessionUser } from "@/lib/auth/types";

const authStorageKey = "cybersense.session.user";
const authEventName = "cybersense:auth-changed";
const authChannelName = "cybersense-auth-channel";

type AuthMessage = {
  type: "auth-changed";
};

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

export function readStoredSessionUser() {
  if (typeof window === "undefined") {
    return null;
  }

  return safeParse(window.localStorage.getItem(authStorageKey));
}

export function writeStoredSessionUser(user: PublicSessionUser) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(authStorageKey, JSON.stringify(user));
}

export function clearStoredSessionUser() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(authStorageKey);
}

export function notifyAuthSessionChanged() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(authEventName));

  try {
    const channel = new BroadcastChannel(authChannelName);
    channel.postMessage({ type: "auth-changed" } satisfies AuthMessage);
    channel.close();
  } catch {
    // BroadcastChannel is not available everywhere. The storage event still helps cross-tab sync.
  }

  window.localStorage.setItem("cybersense.auth.signal", String(Date.now()));
}

export function subscribeToAuthSessionChanges(onChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === "cybersense.auth.signal" || event.key === authStorageKey) {
      onChange();
    }
  };

  const handleEvent = () => onChange();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(authEventName, handleEvent);

  let channel: BroadcastChannel | null = null;
  try {
    channel = new BroadcastChannel(authChannelName);
    channel.addEventListener("message", () => onChange());
  } catch {
    channel = null;
  }

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(authEventName, handleEvent);
    channel?.close();
  };
}
