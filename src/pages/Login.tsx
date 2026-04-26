import React, { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

import { PageMeta } from "../components/site/PageMeta";
import { BRANDING } from "../constants/branding";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { supabase } from "../lib/supabase";

export const Login = () => {
  const { login, signup, signInWithOtp, verifyOtp } = useAuth();
  const { success, error: toastError, info } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
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

  const handleOtpFlow = async () => {
    if (otpSent) {
      const result = await verifyOtp(email, token);
      if (result.success) {
        success("Successfully logged in!");
        navigate("/dashboard");
      } else {
        toastError(`Verification failed: ${result.error}`);
      }
    } else {
      const result = await signInWithOtp(email);
      if (result.success) {
        setOtpSent(true);
        info("Magic Link & Code sent to your email!");
      } else {
        toastError(String(result.error));
      }
    }
  };

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
      const result = await signup(email, password);
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
      if (isOtpMode) {
        await handleOtpFlow();
      } else {
        await handlePasswordFlow();
      }
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
    if (isOtpMode) return otpSent ? "Verify & Login" : "Send Magic Link / OTP";
    if (signupSent) return "Verify Account";
    return isSignUp ? "Create Account" : "Sign In to Hub";
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4">
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
        className="relative z-10 w-full max-w-[380px] rounded-[2rem] border border-white/10 bg-zinc-900/65 p-8 shadow-2xl backdrop-blur-xl"
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
            <Globe className="h-5 w-5" />
            Continue with Google
          </button>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-bold uppercase text-gray-600">or continue with email</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {isOtpMode ? null : (
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
            )}

            {(isOtpMode && otpSent) || signupSent ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center text-xs font-bold text-emerald-300">
                  {signupSent ? "Enter the code from your confirmation email." : "Verification code sent! Enter the 6-digit code."}
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
            ) : null}

            <button
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500 py-3 font-bold text-black shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 disabled:opacity-50"
            >
              {getButtonText()}
            </button>
          </form>

          <div className="space-y-3 text-center">
            {isOtpMode ? null : (
              <button
                type="button"
                onClick={() => setIsSignUp((value) => !value)}
                className="block w-full text-xs font-bold text-white transition-colors hover:text-emerald-500"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsOtpMode((value) => !value)}
              className="block w-full text-xs font-bold text-gray-500 transition-colors hover:text-emerald-500"
            >
              {isOtpMode ? "Use Password Instead" : "Login with Magic Link (OTP)"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
