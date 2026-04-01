import React from "react";
import { ListChecks, ShieldCheck } from "lucide-react";
import { cn } from "@/utils/cn";

interface TraderChecklistProps {
  signalsCount: number;
  hasActiveBot: boolean;
}

export const TraderChecklist: React.FC<TraderChecklistProps> = ({ signalsCount, hasActiveBot }) => {
  const tasks = [
    { id: "signal", label: "Review Daily Signal", done: signalsCount > 0 },
    { id: "bot", label: "Verify Bot Sync", done: hasActiveBot },
    { id: "academy", label: "Scan Academy", done: false }
  ];

  return (
    <section className="mb-12 p-10 rounded-[48px] bg-gradient-to-br from-emerald-500/10 via-black to-black border border-emerald-500/20 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
        <ListChecks className="w-32 h-32 text-emerald-500" />
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
        <div className="flex-1">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-4">Daily Precision Tasks</h2>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest max-w-xl">Complete your daily institutional preparation to maintain high-density execution standards.</p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          {tasks.map((task) => (
            <div key={task.id} className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-3xl border transition-all",
              task.done ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-500" : "bg-white/5 border-white/10 text-gray-500"
            )}>
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border-2", task.done ? "border-emerald-500 bg-emerald-500 text-black" : "border-gray-800 bg-black/40")}>
                {task.done && <ShieldCheck className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{task.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
