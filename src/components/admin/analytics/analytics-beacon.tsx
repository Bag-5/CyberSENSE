"use client";

import { useEffect, useRef } from "react";

import type { AnalyticsEventModule, AnalyticsEventType } from "@/lib/analytics/types";

type AnalyticsBeaconProps = {
  eventType: AnalyticsEventType;
  module: AnalyticsEventModule;
  slug?: string;
  category?: string;
  portal?: "user" | "superadmin";
  metadata?: Record<string, unknown>;
  dedupeKey?: string;
};

function buildBeaconKey(props: AnalyticsBeaconProps) {
  return [
    props.portal ?? "user",
    props.eventType,
    props.module,
    props.slug ?? "",
    props.category ?? "",
    props.dedupeKey ?? "",
  ].join("|");
}

export function AnalyticsBeacon(props: AnalyticsBeaconProps) {
  const sentRef = useRef(false);

  useEffect(() => {
    const key = buildBeaconKey(props);

    if (sentRef.current) {
      return;
    }

    sentRef.current = true;

    if (typeof window !== "undefined") {
      const storageKey = `cybersense.analytics.${key}`;
      if (sessionStorage.getItem(storageKey)) {
        return;
      }
      sessionStorage.setItem(storageKey, "1");
    }

    const payload = JSON.stringify({
      eventType: props.eventType,
      module: props.module,
      slug: props.slug,
      category: props.category,
      portal: props.portal ?? "user",
      metadata: props.metadata ?? {},
    });

    const blob = new Blob([payload], { type: "application/json" });

    if (navigator.sendBeacon("/api/analytics/events", blob)) {
      return;
    }

    void fetch("/api/analytics/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
      keepalive: true,
    });
  }, [props]);

  return null;
}
