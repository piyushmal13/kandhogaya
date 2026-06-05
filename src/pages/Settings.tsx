import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Key, 
  Save, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { supabase } from "../lib/supabase";
import { DashboardLayout } from "@/components/institutional/DashboardLayout";
import { PageMeta } from "@/components/site/PageMeta";
import { EliteButton } from "@/components/ui/Button";

export const Settings = () => {
  const { userProfile, user } = useAuth();
  const { success, error: toastError } = useToast();
  
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || "");
      setPhone((userProfile as any).phone || "");
      setLocation((userProfile as any).crm_metadata?.location || "");
    }
  }, [userProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.id) return;
    
    setSavingProfile(true);
    try {
      const currentCrmMetadata = (userProfile as any).crm_metadata || {};
      const { error } = await supabase
        .from("users")
        .update({
          full_name: fullName,
          phone: phone,
          crm_metadata: {
            ...currentCrmMetadata,
            location: location
          }
        })
        .eq("id", userProfile.id);

      if (error) throw error;
      success("Identity profile updated successfully! Refreshing details...");
      // Reload profile by triggering an event or standard refresh logic
      globalThis.dispatchEvent(new Event("app:login"));
    } catch (err: any) {
      toastError(err.message || "Failed to update profile details.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    if (password !== confirmPassword) {
      toastError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toastError("Password must be at least 6 characters.");
      return;
    }

    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      success("Security credentials updated successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toastError(err.message || "Failed to update credentials.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="pb-24">
        <PageMeta 
          title="Protocol Settings | User Command Center" 
          description="Adjust your security parameters, modify profile credentials, and configure execution nodes."
          path="/settings"
        />

        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header Terminal */}
          <div className="mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-8"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[#00E5FF] text-[10px] font-mono tracking-widest mb-4 uppercase">
                  <Shield className="w-3.5 h-3.5" />
                  Security Nodes Active
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                  Protocol <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Settings</span>
                </h1>
                <p className="text-gray-500 mt-4 max-w-xl text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                  Manage your personal security credentials, view system privileges, and synchronize operator identity with absolute compliance.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Panel: Profile Credentials */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 p-8 md:p-10 bg-[var(--color50)] border border-white/5 rounded-[3rem] space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Operator Identity</h2>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Public identity information mapped to leads and CRM telemetry</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                      Operator Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        required
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-xl border border-white/5 bg-black/40 px-5 py-4 pl-12 text-white outline-none focus:border-cyan-500/30 transition-all font-mono text-sm"
                        placeholder="Operator Name..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-3 block text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                      Verified Contact Email
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        disabled
                        type="email"
                        value={user?.email || ""}
                        className="w-full rounded-xl border border-white/5 bg-white/[0.01] px-5 py-4 pl-12 text-white/40 outline-none cursor-not-allowed font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                      Phone Coordinate
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-white/5 bg-black/40 px-5 py-4 pl-12 text-white outline-none focus:border-cyan-500/30 transition-all font-mono text-sm"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-3 block text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                      Geographic Location
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">
                        <MapPin className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full rounded-xl border border-white/5 bg-black/40 px-5 py-4 pl-12 text-white outline-none focus:border-cyan-500/30 transition-all font-mono text-sm"
                        placeholder="e.g. London, UK"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <EliteButton
                    variant="gemini"
                    glowEffect={true}
                    size="md"
                    disabled={savingProfile}
                    className="px-8 uppercase tracking-widest font-black text-xs"
                  >
                    {savingProfile ? (
                      <>
                        <Activity className="w-4 h-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Identity
                      </>
                    )}
                  </EliteButton>
                </div>
              </form>
            </motion.div>

            {/* Right Panel: Security Credentials & Node Status */}
            <div className="space-y-8">
              
              {/* Security Credentials Password Form */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 bg-[var(--color50)] border border-white/5 rounded-[3rem] space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white uppercase italic tracking-tighter">Security Keys</h2>
                    <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Update your master account login credentials</p>
                  </div>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-white/5 bg-black/40 px-5 py-3.5 pr-12 text-white outline-none focus:border-emerald-500/30 transition-all font-mono text-sm"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                      Confirm Password
                    </label>
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/5 bg-black/40 px-5 py-3.5 text-white outline-none focus:border-emerald-500/30 transition-all font-mono text-sm"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="pt-2">
                    <EliteButton
                      variant="premium-gold"
                      size="md"
                      disabled={updatingPassword || !password}
                      className="w-full uppercase tracking-widest font-black text-xs"
                    >
                      {updatingPassword ? (
                        <>
                          <Activity className="w-4 h-4 animate-spin mr-2" />
                          Modifying Security Key...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </EliteButton>
                  </div>
                </form>
              </motion.div>

              {/* priviledges status card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-[var(--color50)] border border-white/5 rounded-[3rem] space-y-4"
              >
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Operator Node Status</span>
                </div>
                <div className="h-[1px] bg-white/5 w-full" />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                    <span>Role Privilege:</span>
                    <span className="text-white font-mono">{userProfile?.role || "user"}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                    <span>Tier Clearance:</span>
                    <span className={userProfile?.isPro ? "text-emerald-500" : "text-gray-500"}>
                      {userProfile?.isPro ? "Pro Entitled" : "Standard"}
                    </span>
                  </div>
                </div>
              </motion.div>

            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};
