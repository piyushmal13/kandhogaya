import React, { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../lib/supabase";
import { BRANDING } from "../constants/branding";

const AuthContext = createContext<any>(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async (userId: string) => {
      try {
        // 1. Fetch base user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

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
          // Default profile if user record doesn't exist yet
          setUserProfile({ role: 'user', isPro: false });
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setUserProfile({ role: 'user', isPro: false });
      }
    };

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchUserProfile(currentUser.id);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
         await fetchUserProfile(currentUser.id);
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
            <img src={BRANDING.logoUrl} alt="IFXTrades Logo" className="h-full w-auto object-contain" />
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-[0.3em] animate-pulse">Initializing Hub...</div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};
