import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

import { PageMeta } from "../components/site/PageMeta";
import { BRANDING } from "../constants/branding";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { supabase } from "../lib/supabase";

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export const Login = () => {
  const { login, signup, verifyOtp } = useAuth();
  const { success, error: toastError, info } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  
  const [token, setToken] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [signupSent, setSignupSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hash = globalThis.location.hash;
    if (hash?.includes("error_description")) {
      const params = new URLSearchParams(hash.substring(1));
      const errorDesc = params.get("error_description");
      if (errorDesc) {
        toastError(`Authentication Error: ${errorDesc.replaceAll("+", " ")}`);
        globalThis.history.replaceState(null, "", globalThis.location.pathname);
      }
    }
  }, [toastError]);

  const handlePasswordFlow = async () => {
    if (signupSent) {
      const result = await verifyOtp(email, token);
      if (result.success) {
        success("Account verified successfully!");
        navigate("/dashboard");
      } else {
        toastError(`Verification failed: ${result.error}`);
      }
      return;
    }

    if (isSignUp) {
      if (!fullName) {
        toastError("Full Name is required for registration.");
        return;
      }
      if (!phone) {
        toastError("Phone Number is required for registration.");
        return;
      }
      const result = await signup(email, password, fullName, phone);
      if (result.success) {
        setSignupSent(true);
        info("Account created. Please enter the verification code sent to your email.");
      } else {
        toastError(`Signup failed: ${result.error}`);
      }
    } else {
      const result = await login(email, password);
      if (result.success) {
        success("Welcome back!");
        navigate("/dashboard");
      } else {
        toastError(`Login failed: ${result.error}`);
      }
    }
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await handlePasswordFlow();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${globalThis.location.origin}/dashboard`,
      },
    });

    if (error) {
      toastError(error.message);
    }
  };

  const getButtonText = () => {
    if (loading) return "Processing...";
    if (signupSent) return "Verify Account";
    return isSignUp ? "Create Account" : "Sign In to Hub";
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-12">
      <PageMeta
        title="Client Access"
        description="Sign in to IFXTrades to access dashboards, trading products, and client workflows."
        path="/login"
        robots="noindex,follow"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(88,242,182,0.18),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_35%)]" />
      <div className="site-grid absolute inset-0 opacity-30" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[390px] rounded-[2rem] border border-white/10 bg-zinc-900/65 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-auto items-center justify-center">
            <img src={BRANDING.logoUrl} alt={`${BRANDING.name} logo`} className="h-full w-auto object-contain" />
          </div>
          <p className="text-sm text-gray-500">Access the operating surface for disciplined retail traders.</p>
        </div>

        <div className="space-y-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3 font-bold text-black shadow-lg transition-all hover:bg-emerald-300"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-bold uppercase text-gray-600">or continue with credentials</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && !signupSent && (
              <>
                <div>
                  <label htmlFor="fullName" className="mb-2 ml-1 block text-[10px] font-bold uppercase text-gray-500">Full Name</label>
                  <input
                    id="fullName"
                    required
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition-all focus:border-emerald-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 ml-1 block text-[10px] font-bold uppercase text-gray-500">Phone Number</label>
                  <input
                    id="phone"
                    required
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition-all focus:border-emerald-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="mb-2 ml-1 block text-[10px] font-bold uppercase text-gray-500">Email Address</label>
              <input
                id="email"
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition-all focus:border-emerald-500"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 ml-1 block text-[10px] font-bold uppercase text-gray-500">Password</label>
              <input
                id="password"
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition-all focus:border-emerald-500"
                placeholder="********"
              />
            </div>

            {signupSent && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center text-xs font-bold text-emerald-300">
                  Enter the verification code from your confirmation email.
                </div>
                <div>
                  <label htmlFor="otp-token" className="mb-2 ml-1 block text-[10px] font-bold uppercase text-gray-500">Verification Code</label>
                  <input
                    id="otp-token"
                    required
                    type="text"
                    value={token}
                    onChange={(event) => setToken(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition-all focus:border-emerald-500 text-center text-xl tracking-[0.5em] font-mono"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
              </div>
            )}

            <button
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500 py-3 font-bold text-black shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 disabled:opacity-50"
            >
              {getButtonText()}
            </button>
          </form>

          <div className="space-y-3 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp((value) => !value);
                setSignupSent(false);
              }}
              className="block w-full text-xs font-bold text-white transition-colors hover:text-emerald-500"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
