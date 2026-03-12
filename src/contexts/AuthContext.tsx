import React, { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../lib/supabase";
import { BRANDING } from "../constants/branding";

const AuthContext = createContext<any>(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async (userId: string, email?: string) => {
      try {
        // 1. Fetch base user data from public.users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        // 2. Check for active subscriptions in both tables
        const [subResult, signalSubResult] = await Promise.all([
          supabase.from('subscriptions').select('id').eq('user_id', userId).eq('status', 'active').limit(1),
          supabase.from('signal_subscriptions').select('id').eq('user_id', userId).eq('status', 'active').limit(1)
        ]);

        const isPro = (subResult.data && subResult.data.length > 0) || 
                      (signalSubResult.data && signalSubResult.data.length > 0);

        if (!userError && userData) {
          setUserProfile({ ...userData, isPro });
        } else {
          setUserProfile({ 
            id: userId,
            email: email,
            role: 'user', 
            isPro 
          });
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setUserProfile({ role: 'user', isPro: false });
      }
    };

    const checkSession = async () => {
      // 0. Connection Health Check
      try {
        const { error: healthError } = await supabase.from('products').select('id').limit(1);
        if (healthError) {
          console.error("[Supabase Health Check Failed]:", healthError.message);
          if (healthError.message.includes('Failed to fetch')) {
            console.error("CRITICAL: The browser cannot reach Supabase. This usually means the Supabase URL is wrong or CORS is blocking " + window.location.origin);
            setConnectionError(true);
          }
        } else {
          console.log("[Supabase Health Check]: Success.");
          setConnectionError(false);
        }
      } catch (e) {
        console.error("[Supabase Health Check Exception]:", e);
      }

      // Safety timeout: don't block the user for more than 4 seconds
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.warn("Auth initialization timed out. This usually indicates a connection issue with Supabase.");
          setLoading(false);
        }
      }, 4000);

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        const currentUser = session?.user ?? null;
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
      setUser(currentUser);
      if (currentUser) {
         await fetchUserProfile(currentUser.id, currentUser.email);
      } else {
         setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
        emailRedirectTo: window.location.origin + '/dashboard'
      }
    });
    if (error) return { success: false, error: error.message };
    return { success: true, needsEmailConfirmation: !data.session };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, login, signup, logout, loading }}>
      {loading ? (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
          <div className="h-16 w-auto flex items-center justify-center animate-pulse mb-6">
            <img 
              src={BRANDING.logoUrl} 
              alt="IFXTrades Logo" 
              className="h-full w-auto object-contain"
              onError={(e) => {
                // Fallback if the local logo fails
                (e.target as HTMLImageElement).src = BRANDING.fallbackLogoUrl;
              }}
            />
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-[0.3em] animate-pulse mb-4">Initializing Hub...</div>
          
          {connectionError && (
            <div className="max-w-xs text-center p-6 bg-red-500/10 border border-red-500/20 rounded-3xl backdrop-blur-md">
              <p className="text-[10px] text-red-400 font-mono uppercase tracking-widest leading-relaxed mb-4">
                Connection Error: Unable to reach Supabase. <br />
                Please ensure VITE_SUPABASE_URL is correctly set in Vercel.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-red-400 transition-all"
              >
                Retry Connection
              </button>
            </div>
          )}
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};
