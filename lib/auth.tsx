// lib/auth.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth, db } from "./firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import type { UserProfile } from "@/types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);

      // tear down any previous profile listener
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }

      if (u) {
        // subscribe to realtime updates on users/{uid}
        const userDocRef = doc(db, "users", u.uid);
        unsubProfile = onSnapshot(userDocRef, (snap) => {
          if (snap.exists()) {
            setProfile(snap.data() as UserProfile);
          }
        });
      } else {
        // not signed in
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  const login = (email: string, pass: string) =>
    signInWithEmailAndPassword(auth, email, pass).then(() => {});

  const signup = async (
    email: string,
    pass: string,
    username: string
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);

    // random avatar assignment
    const randomId = Math.floor(Math.random() * 99) + 1;
    const avatarUrl = `https://avatar.iran.liara.run/public/${randomId}`;

    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      email,
      username,
      avatarUrl,
      createdAt: serverTimestamp(),
    });
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
