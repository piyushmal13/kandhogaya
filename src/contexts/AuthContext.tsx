import React, { useState, useEffect, createContext, useContext, useMemo, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

// ── Strict Types ─────────────────────────────────────────────────────────────

interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  role: "user" | "admin" | "agent";
  isPro: boolean;
  referred_by?: string;
  avatar_url?: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface SignupResult extends AuthResult {
  needsEmailConfirmation?: boolean;
}

interface OtpVerifyResult extends AuthResult {
  session?: Session;
}

interface AuthContextValue {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (email: string, password: string) => Promise<SignupResult>;
  logout: () => Promise<void>;
  signInWithOtp: (email: string) => Promise<AuthResult>;
  verifyOtp: (email: string, token: string) => Promise<OtpVerifyResult>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

// ── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  // Ref prevents stale-closure bug in the safety timeout
  const loadingRef = useRef(true);

  const fetchUserProfile = useCallback(async (userId: string, email?: string) => {
    try {
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      const [subResult, signalSubResult, licenseResult, webinarResult, courseResult] =
        await Promise.all([
          supabase.from("subscriptions").select("id").eq("user_id", userId).eq("status", "active").limit(1),
          supabase.from("signal_subscriptions").select("id").eq("user_id", userId).eq("status", "active").limit(1),
          supabase.from("bot_licenses").select("id").eq("user_id", userId).eq("is_active", true).limit(1),
          supabase.from("webinar_registrations").select("id").eq("user_id", userId).limit(1),
          supabase.from("user_access").select("id").eq("user_id", userId).limit(1),
        ]);

      const hasAccess =
        (subResult.data?.length ?? 0) > 0 ||
        (signalSubResult.data?.length ?? 0) > 0 ||
        (licenseResult.data?.length ?? 0) > 0 ||
        (webinarResult.data?.length ?? 0) > 0 ||
        (courseResult.data?.length ?? 0) > 0;

      const base = userData || { id: userId, email, role: "user" as const };
      setUserProfile({ ...base, role: base.role ?? "user", isPro: hasAccess });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setUserProfile({ id: userId, email, role: "user", isPro: false });
    }
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      // Connection health check
      try {
        const { error: healthError } = await supabase.from("products").select("id").limit(1);
        if (healthError) {
          console.error("[Supabase Health Check Failed]:", healthError.message);
          if (healthError.message.includes("Failed to fetch")) {
            setConnectionError(true);
          }
        } else {
          setConnectionError(false);
        }
      } catch (e) {
        console.error("[Supabase Health Check Exception]:", e);
      }

      // Safety timeout — uses ref to avoid stale closure
      const timeoutId = setTimeout(() => {
        if (loadingRef.current) {
          console.warn("Auth initialization timed out.");
          loadingRef.current = false;
          setLoading(false);
        }
      }, 4000);

      try {
        const {
          data: { session: currentSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        const currentUser = currentSession?.user ?? null;
        setSession(currentSession);
        setUser(currentUser);

        if (currentUser) {
          await fetchUserProfile(currentUser.id, currentUser.email);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        clearTimeout(timeoutId);
        loadingRef.current = false;
        setLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      const currentUser = newSession?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchUserProfile(currentUser.id, currentUser.email);
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  // Stable function refs — defined with useCallback outside useMemo
  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const signup = useCallback(async (email: string, password: string): Promise<SignupResult> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${globalThis.location.origin}/dashboard` },
    });
    if (error) return { success: false, error: error.message };
    return { success: true, needsEmailConfirmation: !data.session };
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await supabase.auth.signOut();
  }, []);

  const signInWithOtp = useCallback(async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${globalThis.location.origin}/dashboard`,
      },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const verifyOtp = useCallback(async (email: string, token: string): Promise<OtpVerifyResult> => {
    const types = ["signup", "magiclink", "email"] as const;
    for (const type of types) {
      const { data, error } = await supabase.auth.verifyOtp({ email, token, type });
      if (!error && data.session) {
        return { success: true, session: data.session };
      }
    }
    return { success: false, error: "Invalid or expired verification code." };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, userProfile, session, login, signup, logout, loading, signInWithOtp, verifyOtp }),
    [user, userProfile, session, login, signup, logout, loading, signInWithOtp, verifyOtp]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}

      {connectionError && (
        <div className="fixed bottom-4 right-4 z-[9999] max-w-xs p-6 bg-red-500/10 border border-red-500/20 rounded-3xl backdrop-blur-md shadow-2xl">
          <p className="text-[10px] text-red-400 font-mono uppercase tracking-widest leading-relaxed mb-4">
            Connection Error: Unable to reach Supabase. <br />
            Please ensure VITE_SUPABASE_URL is correctly set.
          </p>
          <button
            onClick={() => globalThis.location.reload()}
            className="px-4 py-2 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-red-400 transition-all w-full"
          >
            Retry Connection
          </button>
        </div>
      )}
    </AuthContext.Provider>
  );
};
