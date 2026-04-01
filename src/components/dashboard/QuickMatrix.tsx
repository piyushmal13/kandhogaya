import React from "react";
import { BookOpen, Activity, Bell, Target } from "lucide-react";
import { BRANDING } from "@/constants/branding";

interface QuickMatrixProps {
  navigate: (path: string) => void;
}

export const QuickMatrix: React.FC<QuickMatrixProps> = ({ navigate }) => {
  const items = [
    { label: "Academy", icon: BookOpen, path: "/academy" },
    { label: "Results", icon: Activity, path: "/results" },
    { label: "Alerts", icon: Bell, href: BRANDING.whatsappUrl },
    { label: "Support", icon: Target, path: "/contact" },
  ];

  return (
    <section className="p-10 rounded-[48px] bg-white/5 border border-white/10 backdrop-blur-3xl group">
      <h2 className="text-xl font-black text-white mb-10 uppercase tracking-tighter italic">Quick Matrix</h2>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => item.path ? navigate(item.path) : window.open(item.href, "_blank")}
            className="flex flex-col items-center gap-4 p-8 rounded-[40px] bg-black/40 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all group/btn"
          >
            <item.icon className="w-7 h-7 text-emerald-500 group-hover/btn:scale-110 transition-transform" />
            <span className="text-[9px] font-black uppercase text-gray-500 tracking-[0.1em] group-hover/btn:text-white transition-colors">{item.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
