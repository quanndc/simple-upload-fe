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

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      setUser(firebaseUser);
      console.log(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    const provider = googleAuthProvider ?? new GoogleAuthProvider();
   const credentials = await signInWithPopup(firebaseAuth, provider);
   const user = credentials.user
   const token = await user.getIdToken()
   console.log(token);
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


