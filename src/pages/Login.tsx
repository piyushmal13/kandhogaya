import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { TrendingUp, Globe } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

import { BRANDING } from "../constants/branding";

export const Login = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle Supabase auth errors passed in the URL hash (e.g., expired links)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('error_description')) {
      const params = new URLSearchParams(hash.substring(1));
      const errorDesc = params.get('error_description');
      if (errorDesc) {
        // Replace + with spaces for readability
        alert(`Authentication Error: ${errorDesc.replace(/\+/g, ' ')}`);
        // Clean up the URL so it doesn't keep showing the error on refresh
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (isOtpMode) {
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: window.location.origin + '/dashboard'
        }
      });
      if (error) alert(error.message);
      else setOtpSent(true);
    } else {
      if (isSignUp) {
        const result = await signup(email, password);
        if (result.success) {
          if (result.needsEmailConfirmation) {
            alert("Account created! Please check your email to confirm your account before logging in.");
          } else {
            alert("Account created successfully! You can now log in.");
          }
          setIsSignUp(false);
        } else {
          alert(`Signup failed: ${result.error}`);
        }
      } else {
        const result = await login(email, password);
        if (result.success) {
          navigate("/dashboard");
        } else {
          alert(`Login failed: ${result.error}`);
        }
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A192F] px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#10b98110,transparent_70%)]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="h-16 w-auto flex items-center justify-center mx-auto mb-6">
            <img 
              src={BRANDING.logoUrl} 
              alt="IFXTrades Logo" 
              className="h-full w-auto object-contain" 
            />
          </div>
          <p className="text-gray-500 text-sm">Access the Operating System for Retail Traders</p>
        </div>

        <div className="space-y-6">
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all shadow-lg"
          >
            <Globe className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="flex items-center gap-4">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[10px] text-gray-600 font-bold uppercase">or continue with email</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1">Email Address</label>
              <input 
                required
                type="email"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500 transition-all" 
                placeholder="name@company.com"
              />
            </div>
            
            {!isOtpMode && (
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1">Password</label>
                <input 
                  required
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500 transition-all" 
                  placeholder="••••••••"
                />
              </div>
            )}

            {otpSent && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-xs font-bold text-center">
                Magic link sent! Check your email to login.
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full py-4 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? "Processing..." : (isOtpMode ? "Send Magic Link" : (isSignUp ? "Create Account" : "Sign In to Hub"))}
            </button>
          </form>

          <div className="text-center space-y-3">
            {!isOtpMode && (
              <button 
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-white hover:text-emerald-500 transition-colors font-bold block w-full"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            )}
            <button 
              type="button"
              onClick={() => setIsOtpMode(!isOtpMode)}
              className="text-xs text-gray-500 hover:text-emerald-500 transition-colors font-bold block w-full"
            >
              {isOtpMode ? "Use Password Instead" : "Login with Magic Link (OTP)"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
