import React, { useState, useEffect, createContext, useContext, useMemo } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext<any>(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async (userId: string, email?: string) => {
      try {
        // 1. Fetch base user data
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        // 2. Fetch all types of "access"
        const [
          subResult, 
          signalSubResult, 
          licenseResult, 
          webinarResult, 
          courseResult
        ] = await Promise.all([
          supabase.from('subscriptions').select('id').eq('user_id', userId).eq('status', 'active').limit(1),
          supabase.from('signal_subscriptions').select('id').eq('user_id', userId).eq('status', 'active').limit(1),
          supabase.from('bot_licenses').select('id').eq('user_id', userId).eq('is_active', true).limit(1),
          supabase.from('webinar_registrations').select('id').eq('user_id', userId).limit(1),
          supabase.from('user_access').select('id').eq('user_id', userId).limit(1)
        ]);

        const hasAccess = 
          (subResult.data?.length ?? 0) > 0 || 
          (signalSubResult.data?.length ?? 0) > 0 ||
          (licenseResult.data?.length ?? 0) > 0 ||
          (webinarResult.data?.length ?? 0) > 0 ||
          (courseResult.data?.length ?? 0) > 0;

        const profile = userData || { id: userId, email, role: 'user' };
        setUserProfile({ ...profile, isPro: hasAccess });
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setUserProfile({ id: userId, email, role: 'user', isPro: false });
      }
    };

    const checkSession = async () => {
      // 0. Connection Health Check
      try {
        const { error: healthError } = await supabase.from('products').select('id').limit(1);
        if (healthError) {
          console.error("[Supabase Health Check Failed]:", healthError.message);
          if (healthError.message.includes('Failed to fetch')) {
            console.error("CRITICAL: The browser cannot reach Supabase. This usually means the Supabase URL is wrong or CORS is blocking " + globalThis.location.origin);
            setConnectionError(true);
          }
        } else {
          console.log("[Supabase Health Check]: Success.");
          setConnectionError(false);
        }
      } catch (e) {
        console.error("[Supabase Health Check Exception]:", e);
      }

      // Safety timeout
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.warn("Auth initialization timed out.");
          setLoading(false);
        }
      }, 4000);

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        const currentUser = session?.user ?? null;
        setSession(session);
        setUser(currentUser);
        
        if (currentUser) {
          await fetchUserProfile(currentUser.id, currentUser.email);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setSession(session);
      setUser(currentUser);
      if (currentUser) {
         await fetchUserProfile(currentUser.id, currentUser.email);
      } else {
         setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [loading]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const signup = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: globalThis.location.origin + '/dashboard'
      }
    });
    if (error) return { success: false, error: error.message };
    return { success: true, needsEmailConfirmation: !data.session };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const signInWithOtp = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ 
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: globalThis.location.origin + '/dashboard'
      }
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const verifyOtp = async (email: string, token: string) => {
    // Attempt multiple verification types (signup, magiclink, etc.)
    const types: any[] = ['signup', 'magiclink', 'email'];
    
    for (const type of types) {
      const { data, error } = await supabase.auth.verifyOtp({ email, token, type });
      if (!error && data.session) {
        return { success: true, session: data.session };
      }
    }
    
    return { success: false, error: "Invalid or expired verification code." };
  };

  const value = useMemo(() => ({
    user, userProfile, session, login, signup, logout, loading, signInWithOtp, verifyOtp
  }), [user, userProfile, session, loading]);

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
