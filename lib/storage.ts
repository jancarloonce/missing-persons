// lib/storage.ts
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Uploads one file to `cases/{caseId}` and returns its public URL.
 */
export async function uploadCasePhoto(caseId: string, file: File): Promise<string> {
  const uniqueName = `${file.name.replace(/\s+/g, "_")}-${Date.now()}`;
  const storageRef = ref(storage, `cases/${caseId}/${uniqueName}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

/**
 * Uploads a user avatar to `avatars/{uid}` and returns its public URL.
 */
export async function uploadAvatar(uid: string, file: File): Promise<string> {
  const uniqueName = `avatar_${Date.now()}`;
  const storageRef = ref(storage, `avatars/${uid}/${uniqueName}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
