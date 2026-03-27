import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Database } from "lucide-react";
import { getCache, setCache } from "@/utils/cache";

export const SupabaseStatus = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    let isMounted = true;

    const checkConnection = async () => {
      const cacheKey = "supabase_status";
      const cachedResult = getCache(cacheKey);
      if (cachedResult === 'connected') {
        setStatus('connected');
        return;
      }
      
      try {
        // Simple query to check connectivity
        const { error } = await supabase.from('webinars').select('id', { count: 'exact', head: true });
        
        if (!isMounted) return;

        if (error) {
          console.warn("[Supabase] Connection check failed:", error.message);
          setStatus('error');
        } else {
          setCache(cacheKey, 'connected');
          setStatus('connected');
        }
      } catch (err) {
        if (isMounted) {
          console.error("[Supabase] Connection exception:", err);
          setStatus('error');
        }
      }
    };

    checkConnection();

    return () => {
      isMounted = false;
    };
  }, []);

  if (status === 'checking') return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
      <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {status === 'connected' ? 'DB Live' : 'DB Offline'}
      </span>
      <Database className="w-3 h-3 text-gray-500" />
    </div>
  );
};
