import React, { useState, useEffect, createContext, useContext, useMemo, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { getAccess, Entitlement } from "../core/accessEngine";

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
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [loading, setLoading] = useState(true);

  // Safety and Optimization Refs
  const loadingRef = useRef(true);
  const isFetchingRef = useRef(false);
  const lastFetchedId = useRef<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchUserProfile = useCallback(async (userId: string, email?: string) => {
    // 1. Execution lock - prevent concurrent fetches for same user
    if (isFetchingRef.current) return;
    if (lastFetchedId.current === userId) return;

    isFetchingRef.current = true;
    lastFetchedId.current = userId;

    const retry = async (fn: () => Promise<any>, attempts = 2) => {
      try {
        return await fn();
      } catch (err) {
        console.error("Institutional Fetch Signal: Retry attempt failed.", err);
        if (attempts > 0) return retry(fn, attempts - 1);
        return null;
      }
    };

    try {
      // 2. Core user fetch
      const userRes = await retry(() =>
        Promise.resolve(
          supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .maybeSingle()
        )
      );

      const userData = userRes?.data || null;

      // 3. Metadata sweep (decentralized)
      const metadataQueries = [
        () => Promise.resolve(supabase.from("subscriptions").select("id").eq("user_id", userId).eq("status", "active").limit(1)),
        () => Promise.resolve(supabase.from("signal_subscriptions").select("id").eq("user_id", userId).eq("status", "active").limit(1)),
        () => Promise.resolve(supabase.from("bot_licenses").select("id").eq("user_id", userId).eq("is_active", true).limit(1)),
        () => Promise.resolve(supabase.from("webinar_registrations").select("id").eq("user_id", userId).limit(1)),
        () => Promise.resolve(supabase.from("user_access").select("id").eq("user_id", userId).limit(1)),
      ];

      const results = await Promise.allSettled(metadataQueries.map(q => retry(q)));

      const hasAccess = results.some(
        (res) => res.status === "fulfilled" && res.value?.data && res.value.data.length > 0
      );

      // 4. Entitlement Discovery
      const entitlementRes = await retry(() => 
        Promise.resolve(supabase.from("user_entitlements").select("*").eq("user_id", userId))
      );
      const entitlementData = entitlementRes?.data || [];

      // 5. Safe state updates
      if (isMountedRef.current) {
        const base = userData || { id: userId, email, role: "user" as const };
        
        setEntitlements(entitlementData);
        setUserProfile({
          ...base,
          role: base.role ?? "user",
          isPro: hasAccess,
        });
      }
    } catch {
      if (isMountedRef.current) {
        setUserProfile({ id: userId, email, role: "user", isPro: false });
        setEntitlements([]);
      }
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Component lifecycle tracking
    isMountedRef.current = true;

    const checkSession = async () => {
      const timeoutId = setTimeout(() => {
        if (loadingRef.current && isMountedRef.current) {
          loadingRef.current = false;
          setLoading(false);
        }
      }, 4000);

      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (isMountedRef.current) {
          const currentUser = currentSession?.user ?? null;
          setSession(currentSession);
          setUser(currentUser);

          if (currentUser) {
            await fetchUserProfile(currentUser.id, currentUser.email);
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        clearTimeout(timeoutId);
        if (loadingRef.current && isMountedRef.current) {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMountedRef.current) return;

      // Force refresh on critical events
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        lastFetchedId.current = null; // Reset lock to allow fresh fetch
      }

      setSession(newSession);
      const currentUser = newSession?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        fetchUserProfile(currentUser.id, currentUser.email);
      } else {
        setUserProfile(null);
        lastFetchedId.current = null;
      }
    });

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

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
    lastFetchedId.current = null;
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

  const access = useMemo(() => getAccess(userProfile, entitlements), [userProfile, entitlements]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, userProfile, session, login, signup, logout, loading, signInWithOtp, verifyOtp, entitlements, access }),
    [user, userProfile, session, login, signup, logout, loading, signInWithOtp, verifyOtp, entitlements, access]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}

    </AuthContext.Provider>
  );
};
