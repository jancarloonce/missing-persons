// types.ts
import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;             // Firebase Auth UID
  email: string;
  username: string;
  avatarUrl?: string;      // ← new
  createdAt: Timestamp;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  reporterId: string;
  reporterName: string;
  createdAt: Timestamp;
  photoUrls?: string[];
}

export interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: Timestamp;
}

export type NewCase = Omit<Case, "id" | "createdAt" | "photoUrls">;
export type NewComment = Omit<Comment, "id" | "createdAt">;
