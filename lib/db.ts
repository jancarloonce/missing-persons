// lib/db.ts
import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import type {
  Case,
  NewCase,
  Comment,
  NewComment,
  UserProfile,
} from "@/types";

const casesCol = collection(db, "cases");

// — CASE HELPERS —

/**
 * Creates a new case in Firestore, initializing photoUrls if provided.
 */
export const createCase = (c: NewCase & { photoUrls?: string[] }) =>
  addDoc(casesCol, {
    ...c,
    createdAt: serverTimestamp(),
    photoUrls: c.photoUrls ?? [],
  });

/**
 * Subscribes to all cases in real time, newest first.
 */
export const listenCases = (cb: (cases: Case[]) => void) =>
  onSnapshot(
    query(casesCol, orderBy("createdAt", "desc")),
    (snap) =>
      cb(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Case, "id">),
        }))
      )
  );

/**
 * Fetches one case by ID.
 */
export const getCase = async (caseId: string): Promise<Case | null> => {
  const ref = doc(db, "cases", caseId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Case, "id">) };
};

// — COMMENT HELPERS —

/**
 * Subscribes to comments under a case in real time.
 */
export const listenComments = (
  caseId: string,
  cb: (comments: Comment[]) => void
) => {
  const commentsCol = collection(db, "cases", caseId, "comments");
  return onSnapshot(
    query(commentsCol, orderBy("createdAt", "asc")),
    (snap) =>
      cb(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Comment, "id">),
        }))
      )
  );
};

/**
 * Adds a new comment to a case.
 */
export const createComment = (caseId: string, c: NewComment) =>
  addDoc(collection(db, "cases", caseId, "comments"), {
    ...c,
    createdAt: serverTimestamp(),
  });

// — USER PROFILE HELPERS —

/**
 * Updates the user's profile fields. Only include
 * `username` or `avatarUrl` (or both) in the `data` object.
 */
export const updateUserProfile = (
  uid: string,
  data: Partial<Pick<UserProfile, "username" | "avatarUrl">>
) => {
  const userRef = doc(db, "users", uid);
  return updateDoc(userRef, data);
};
