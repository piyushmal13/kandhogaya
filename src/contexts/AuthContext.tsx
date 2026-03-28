import React, { useState, useEffect, createContext, useContext, useMemo, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { getAccess, Entitlement } from "../core/accessEngine";
import { clearCache } from "../utils/cache";
import { tracker } from "../core/tracker";

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
  sessionReady: boolean;
  loading: boolean;
  entitlements: Entitlement[];
  access: ReturnType<typeof getAccess>;
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
  const [sessionReady, setSessionReady] = useState(false);
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [loading, setLoading] = useState(true);

  // Safety and Optimization Refs
  const isFetchingRef = useRef(false);
  const lastFetchedId = useRef<string | null>(null);
  const isMountedRef = useRef(true);

    const fetchUserProfile = useCallback(async (userId: string, email?: string) => {
      if (isFetchingRef.current || lastFetchedId.current === userId) return;

      isFetchingRef.current = true;
      lastFetchedId.current = userId;

      const retry = async (fn: () => Promise<any>, attempts = 2) => {
        try {
          return await fn();
        } catch (err) {
          console.error(`[Auth] Discovery Retry Failure (Attempts: ${attempts}):`, err);
          if (attempts > 0) return retry(fn, attempts - 1);
          return null;
        }
      };

      try {
        // CONCURRENT Artifact Discovery
        const [userRes, entitlementRes] = await Promise.all([
          retry(async () => await supabase.from("users").select("*").eq("id", userId).maybeSingle()),
          retry(async () => await supabase.from("user_entitlements").select("*").eq("user_id", userId))
        ]);

        const userData = userRes?.data || null;
        const entitlementData = entitlementRes?.data || [];

        if (isMountedRef.current) {
          const base = userData || { id: userId, email, role: "user" as const };
          setEntitlements(entitlementData);
          setUserProfile({
            ...base,
            role: base.role ?? "user",
            isPro: entitlementData.some(e => e.active),
          });
        }
      } catch (err) {
        console.error("Institutional Identity Discovery Error:", err);
      } finally {
        isFetchingRef.current = false;
      }
    }, []);

  useEffect(() => {
    isMountedRef.current = true;

    const initializeAuth = async () => {
      if (sessionReady && user) return; // Guard against roaming refreshes
      
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (isMountedRef.current) {
          setSession(currentSession);
          const currentUser = currentSession?.user ?? null;
          setUser(currentUser);

          if (currentUser) {
            await fetchUserProfile(currentUser.id, currentUser.email);
            setSessionReady(true);
            globalThis.dispatchEvent(new Event("supabase:ready"));
          } else {
            setSessionReady(true);
            globalThis.dispatchEvent(new Event("supabase:ready"));
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMountedRef.current) return;

      if (event === 'SIGNED_IN') {
        clearCache();
        // Skip manual setSession if onAuthStateChange already provided it
        if (!user && newSession?.user) {
          setUser(newSession.user);
          setSession(newSession);
        }
        globalThis.dispatchEvent(new Event("app:login"));
        globalThis.dispatchEvent(new Event("supabase:refresh"));
        
        // Re-calculate user profile on login
        if (newSession?.user) {
          tracker.track("login", { protocol: "institutional" });
          await fetchUserProfile(newSession.user.id, newSession.user.email);
        }

        setTimeout(() => {
          if (isMountedRef.current) {
            setSessionReady(true);
            globalThis.dispatchEvent(new Event("supabase:ready"));
          }
        }, 100);
      } else if (event === 'SIGNED_OUT') {
        clearCache();
        setSessionReady(false);
        setUser(null);
        setSession(null);
        setUserProfile(null);
        setEntitlements([]);
        lastFetchedId.current = null;
        tracker.track("logout", { session: "terminated" });
        globalThis.dispatchEvent(new Event("app:logout"));
      } else if (event === 'TOKEN_REFRESHED') {
        setSession(newSession);
      }
    });

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const logout = useCallback(async () => {
    lastFetchedId.current = null;
    await supabase.auth.signOut();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { success: false, error: error.message } : { success: true };
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${globalThis.location.origin}/dashboard` },
    });
    if (!error && data.user) {
      tracker.track("signup", { email });
    }
    return error ? { success: false, error: error.message } : { success: true, needsEmailConfirmation: !data.session };
  }, []);

  const signInWithOtp = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, emailRedirectTo: `${globalThis.location.origin}/dashboard` },
    });
    return error ? { success: false, error: error.message } : { success: true };
  }, []);

  const verifyOtp = useCallback(async (email: string, token: string) => {
    const types = ["signup", "magiclink", "email"] as const;
    for (const type of types) {
      const { data, error } = await supabase.auth.verifyOtp({ email, token, type });
      if (!error && data.session) return { success: true, session: data.session };
    }
    return { success: false, error: "Invalid or expired verification code." };
  }, []);

  const access = useMemo(() => getAccess(userProfile, entitlements), [userProfile, entitlements]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, userProfile, session, sessionReady, loading, login, signup, logout, signInWithOtp, verifyOtp, entitlements, access }),
    [user, userProfile, session, sessionReady, loading, login, signup, logout, signInWithOtp, verifyOtp, entitlements, access]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
