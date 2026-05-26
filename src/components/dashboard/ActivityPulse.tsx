import React, { useState, useEffect } from "react";
import { 
  Zap, TrendingUp, UserPlus, 
  ShoppingCart, LucideIcon
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useRealtime } from "../../hooks/useRealtime";

interface ActivityEvent {
  id: string | number;
  type: string;
  user: string;
  time: string;
  icon: LucideIcon;
  color: string;
}

const MOCK_EVENTS: ActivityEvent[] = [
  { id: 1, type: "registration", user: "Alexander R.", time: "2m ago", icon: UserPlus, color: "text-emerald-500" },
  { id: 2, type: "sale", user: "Pro Trader", time: "5m ago", icon: ShoppingCart, color: "text-blue-500" },
  { id: 3, type: "signal", user: "BTC Long", time: "12m ago", icon: TrendingUp, color: "text-orange-500" },
  { id: 4, type: "capture", user: "Institutional", time: "15m ago", icon: Zap, color: "text-purple-500" }
];

export const ActivityPulse = () => {
  const { data: liveEvents } = useRealtime<ActivityEvent>(
    "user_events",
    undefined,
    undefined,
    (raw: any) => {
      let icon = Zap;
      let color = "text-purple-500";
      const type = raw.event_type || "activity";
      
      if (type.includes("signup") || type.includes("register")) {
        icon = UserPlus;
        color = "text-emerald-500";
      } else if (type.includes("purchase") || type.includes("sale") || type.includes("pay")) {
        icon = ShoppingCart;
        color = "text-blue-500";
      } else if (type.includes("signal")) {
        icon = TrendingUp;
        color = "text-orange-500";
      }

      let displayUser = "Anonymous";
      if (raw.metadata?.user_email) {
        displayUser = raw.metadata.user_email.split('@')[0];
      } else if (raw.metadata?.email) {
        displayUser = raw.metadata.email.split('@')[0];
      } else if (raw.anon_id) {
        displayUser = `Session ${raw.anon_id.replace("anon_", "").substring(0, 6)}`;
      }

      let displayTime = "Just now";
      const timestamp = raw.created_at || raw.event_at;
      if (timestamp) {
        const date = new Date(timestamp);
        const diffMs = Date.now() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins > 0) {
          displayTime = `${diffMins}m ago`;
        }
      }

      return {
        id: raw.id,
        type,
        user: displayUser,
        time: displayTime,
        icon,
        color
      };
    }
  );

  const [events, setEvents] = useState<ActivityEvent[]>(MOCK_EVENTS);

  useEffect(() => {
    if (liveEvents && liveEvents.length > 0) {
      setEvents(liveEvents.slice(0, 4));
    } else {
      setEvents(MOCK_EVENTS);
    }
  }, [liveEvents]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prev => {
        if (prev.length <= 1) return prev;
        const next = [...prev];
        const last = next.pop();
        if (last) next.unshift(last);
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-[40px] p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-black text-white uppercase tracking-widest italic flex items-center gap-3">
          <ActivityPulseIcon />
          Institutional Pulse
        </h3>
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Live</span>
      </div>

      <div className="space-y-6">
        {events.map((e, i) => (
          <div key={e.id} className={cn(
            "flex items-center gap-5 transition-all duration-700",
            i === 0 ? "scale-105 opacity-100" : "scale-100 opacity-40 hover:opacity-70"
          )}>
            <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center", e.color)}>
               <e.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
               <div className="text-[11px] font-black text-white uppercase tracking-tight">{e.user}</div>
               <div className="text-[9px] font-medium text-gray-500 uppercase tracking-widest">{e.type}</div>
            </div>
            <div className="text-[9px] font-black text-gray-700 uppercase">{e.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ActivityPulseIcon = () => (
  <div className="relative w-4 h-4">
    <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
    <div className="absolute inset-1 bg-emerald-500 rounded-full" />
  </div>
);

