"use client";

import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { firebaseAuth, googleAuthProvider } from "@/lib/firebase";
import { API_BASE_URL } from "@/lib/api";

async function callCheckAuth(user: User) {
  try {
    const token = await user.getIdToken();
    await fetch(`${API_BASE_URL}/api/auth/check-auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ uid: user.uid }),
    });
  } catch {
  }
}

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        await callCheckAuth(firebaseUser);
      }
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    const provider = googleAuthProvider ?? new GoogleAuthProvider();
    await signInWithPopup(firebaseAuth, provider);
  };

  const logout = async () => {
    await signOut(firebaseAuth);
  };

  return {
    user,
    loading,
    loginWithGoogle,
    logout,
  };
}


