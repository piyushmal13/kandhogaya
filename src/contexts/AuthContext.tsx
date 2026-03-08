import React, { useState, useEffect, createContext, useContext } from "react";
import { TrendingUp } from "lucide-react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext<any>(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const timeout = setTimeout(() => {
          if (loading) {
            console.warn("Supabase session check timed out. Proceeding as guest.");
            setLoading(false);
          }
        }, 3000);

        const { data: { session } } = await supabase.auth.getSession();
        clearTimeout(timeout);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (err) {
        console.error("Auth initialization error:", err);
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Login error:", error.message);
      return false;
    }
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {loading ? (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
          <div className="h-16 w-auto flex items-center justify-center animate-pulse mb-6">
            <img 
              src="/logo.png" 
              alt="IFXTrades Logo" 
              className="h-full w-auto object-contain" 
            />
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-[0.3em] animate-pulse">Initializing Intelligence...</div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};
