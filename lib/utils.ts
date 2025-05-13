// lib/utils.ts
import type { Timestamp } from "firebase/firestore";

/**
 * Returns a human-friendly date string:
 * • If ts.seconds exists, uses that exact date.
 * • Otherwise returns “just now”.
 */
export function formatDate(ts?: Timestamp | null): string {
  if (ts?.seconds) {
    return new Date(ts.seconds * 1000).toLocaleString();
  }
  return "just now";
}
