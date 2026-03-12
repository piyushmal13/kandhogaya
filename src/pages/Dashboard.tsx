import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Zap, ShieldCheck, Bell, Settings } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase, safeQuery } from "../lib/supabase";
import { cn } from "../utils/cn";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const { user, userProfile } = useAuth();
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchDashboardData = async () => {
        setLoading(true);
        // Using safeQuery to prevent crashes if table is empty or missing
        // The correct table name is 'bot_licenses' per the schema
        const licenseData = await safeQuery(
          supabase
            .from('bot_licenses')
            .select('*, products(name)')
            .eq('user_id', user.id)
        );
        
        setLicenses(Array.isArray(licenseData) ? licenseData : []);
        setLoading(false);
      };
      fetchDashboardData();
    }
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  const isAdmin = userProfile?.role === 'admin' || 
                  user.email === 'admin@ifxtrades.com' || 
                  user.email === 'admin@tradinghub.com' || 
                  user.email === 'piyushmal1301@gmail.com';

  const isPro = userProfile?.isPro === true;

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <h1 className="text-3xl font-bold text-white">
          Welcome, {userProfile?.full_name || user.user_metadata?.full_name || user.email}
        </h1>
        <div className="flex gap-4">
          {isAdmin && (
            <Link to="/admin" className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition-all">
              <Settings className="w-4 h-4" />
              Admin Panel
            </Link>
          )}
          <div className={cn(
            "px-4 py-2 rounded-lg flex items-center border",
            isPro ? "bg-emerald-500/10 border-emerald-500/20" : "bg-zinc-800 border-white/5"
          )}>
            <span className={cn(
              "text-xs font-bold uppercase",
              isPro ? "text-emerald-500" : "text-gray-500"
            )}>
              {isPro ? "Pro Member" : "Free Member"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Active Subscriptions & Licenses</h2>
            
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-16 bg-white/5 rounded-xl" />
                <div className="h-16 bg-white/5 rounded-xl" />
              </div>
            ) : (
              <div className="space-y-4">
                {isPro && (
                  <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <Zap className="text-emerald-500" />
                      <div>
                        <div className="text-white font-bold">Elite Signals</div>
                        <div className="text-xs text-gray-500">Active Subscription</div>
                      </div>
                    </div>
                    <button type="button" onClick={() => alert("Opening subscription manager...")} className="text-xs text-gray-400 hover:text-white">Manage</button>
                  </div>
                )}
                
                {licenses.length > 0 ? (
                  licenses.map((license: any) => (
                    <div key={license.id} className="flex items-center justify-between p-4 bg-black rounded-xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <ShieldCheck className="text-emerald-500" />
                        <div>
                          <div className="text-white font-bold">{license.products?.name || "Algo Bot License"}</div>
                          <div className="text-xs text-gray-500">Expires: {new Date(license.expires_at).toLocaleDateString()}</div>
                          <div className="text-[10px] text-emerald-500 font-mono mt-1">Key: {license.license_key}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn("text-xs font-bold px-2 py-1 rounded", license.is_active ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                          {license.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : !isPro && (
                  <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                    <p className="text-gray-500 text-sm mb-4">No active licenses or subscriptions found.</p>
                    <Link to="/marketplace" className="text-emerald-500 text-sm font-bold hover:underline">
                      Browse Marketplace
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => alert("Viewing licenses...")} className="flex flex-col items-center gap-2 p-4 bg-black rounded-xl border border-white/5 hover:border-emerald-500/50 transition-all">
                <ShieldCheck className="text-emerald-500" />
                <span className="text-xs text-white">Licenses</span>
              </button>
              <button type="button" onClick={() => alert("Viewing alerts...")} className="flex flex-col items-center gap-2 p-4 bg-black rounded-xl border border-white/5 hover:border-emerald-500/50 transition-all">
                <Bell className="text-emerald-500" />
                <span className="text-xs text-white">Alerts</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
