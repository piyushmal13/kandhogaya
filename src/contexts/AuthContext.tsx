import React, { useState, useEffect, createContext, useContext, useMemo, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { getSecureItem, setSecureItem, removeSecureItem } from "../lib/secureStore";
import type { User, Session } from "@supabase/supabase-js";
import { getAccess, Entitlement } from "../core/accessEngine";
import { clearCache } from "../utils/cache";
import { tracker } from "../core/tracker";

// ── Strict Types ─────────────────────────────────────────────────────────────

interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  role: "user" | "admin" | "agent" | "sales_agent" | "support" | "analyst";
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
      if (isFetchingRef.current || (lastFetchedId.current === userId && userProfile)) return;

      isFetchingRef.current = true;
      lastFetchedId.current = userId;

      try {
        const cachedProfile = await getSecureItem<UserProfile>('encrypted_profile');
        if (cachedProfile?.id === userId && isMountedRef.current) {
           setUserProfile(cachedProfile);
           // Hydrate entitlements for access engine
           const curEnts = (await getSecureItem<Entitlement[]>('encrypted_ents')) ?? [];
           setEntitlements(curEnts);
        }

        const [userRes, entitlementRes, sessionData] = await Promise.all([
          supabase.from("users").select("id, email, full_name, role, referred_by, avatar_url").eq("id", userId).maybeSingle(),
          supabase.from("user_entitlements").select("id, user_id, product_id, active, expires_at").eq("user_id", userId),
          supabase.auth.getSession()
        ]);

        const userData = userRes?.data || null;
        const rawEntitlements = entitlementRes?.data || [];
        // Map DB rows to the Entitlement shape the access engine expects
        const entitlementData: Entitlement[] = rawEntitlements.map((e: any) => ({
          feature:    e.product_id || e.feature || "unknown",
          active:     e.active ?? false,
          expires_at: e.expires_at ?? null,
        }));
        
        // Institutional Validation: Extract custom claim or fallback to database role
        const tokenRole = sessionData.data.session?.user?.app_metadata?.role;
        const serverRole = (tokenRole || userData?.role || "user") as UserProfile["role"];

        if (isMountedRef.current) {
          const base = userData || { id: userId, email, role: "user" as const };
          setEntitlements(entitlementData);
          
          const profileData = {
            ...base,
            role: serverRole,
            isPro: entitlementData.some(e => e.active) || serverRole === "admin",
          };
          
          setUserProfile(profileData);
          
          // Secure Payload Persistence
          await setSecureItem('encrypted_profile', profileData);
          await setSecureItem('encrypted_ents', entitlementData);
        }
      } catch (err) {
        console.error("Institutional Identity Discovery Error (Recovery Active):", err);
        if (isMountedRef.current) {
           const fallbackRole = "user";
           setUserProfile({ id: userId, email, role: fallbackRole as any, isPro: false });
        }
      } finally {
        isFetchingRef.current = false;
        if (isMountedRef.current) {
           setLoading(false);
           setSessionReady(true);
        }
      }
    }, [userProfile]);

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

      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        clearCache();
        
        if (newSession?.user) {
          const userId = newSession.user.id;
          
          // Cross-session identification (anon -> user)
          tracker.identify(userId);
          
          // Institutional Referral Resolution
          const resolveReferral = async () => {
            const refCode = localStorage.getItem('ifx_referral_code');
            if (!refCode) return;

            try {
              // 1. Discovery: Find the agent linked to this code
              const { data: codeData } = await supabase
                .from('affiliate_codes')
                .select('user_id')
                .eq('code', refCode)
                .single();

              if (codeData) {
                // 2. Attribution: Link user to agent
                await supabase
                  .from('users')
                  .update({ referred_by: codeData.user_id })
                  .eq('id', userId)
                  .is('referred_by', null); // Only if not already set
                
                // 3. Telemetry: Track the conversion
                tracker.track("referral_resolved", { code: refCode, agent_id: codeData.user_id });
                
                // Clear to prevent multi-attribution
                localStorage.removeItem('ifx_referral_code');
              }
            } catch (err) {
              console.warn("Referral resolution failed:", err);
            }
          };

          resolveReferral();
          
          if (!user) {
            setUser(newSession.user);
            setSession(newSession);
          }
          
          tracker.track(event === 'SIGNED_IN' ? "login" : "session_restore", { protocol: "institutional" });
          await fetchUserProfile(userId, newSession.user.email || undefined);
        }

        globalThis.dispatchEvent(new Event("app:login"));
        globalThis.dispatchEvent(new Event("supabase:ready"));
        setSessionReady(true);
      } else if (event === 'SIGNED_OUT') {
        clearCache();
        setSessionReady(false);
        setUser(null);
        setSession(null);
        setUserProfile(null);
        setEntitlements([]);
        lastFetchedId.current = null;
        
        // Secure wipe
        removeSecureItem('encrypted_profile');
        removeSecureItem('encrypted_ents');
        
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
    try {
      lastFetchedId.current = null;
      await supabase.auth.signOut();
      
      // Strict State Purge
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setEntitlements([]);
      clearCache();
      
      // Secure wipe
      await removeSecureItem('encrypted_profile');
      await removeSecureItem('encrypted_ents');
      
      globalThis.dispatchEvent(new Event("app:logout"));
      globalThis.location.href = "/login"; // Force full state purge
    } catch (err) {
      console.error("Institutional Session Termination Failure:", err);
      // Fallback redirect
      globalThis.location.href = "/login";
    }
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
