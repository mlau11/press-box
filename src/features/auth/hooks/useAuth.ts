import { supabase } from "@/lib/supabase";
import { useState } from "react";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUpWithEmail = async (
    email: string,
    password: string,
    username: string,
  ) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) setError(error.message);
    setLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const sendPasswordReset = async (email: string) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    setLoading(false);
    return !error;
  };

  return {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    sendPasswordReset,
    loading,
    error,
  };
};
