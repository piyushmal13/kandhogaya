import React from "react";
import { motion } from "motion/react";
import { Zap, Globe, MessageSquare } from "lucide-react";

export const Hiring = () => (
  <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
    <div className="text-center mb-20">
      <span className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em] mb-4 inline-block">Careers</span>
      <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">Join the Elite Team</h1>
      <p className="text-gray-400 max-w-2xl mx-auto text-lg">We are looking for the brightest minds in trading, development, and content creation to help us build the future of retail trading.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
      {[
        { title: "Senior Analyst", type: "Full-time", dept: "Trading", icon: Zap },
        { title: "Full Stack Engineer", type: "Remote", dept: "Engineering", icon: Globe },
        { title: "Content Strategist", type: "Contract", dept: "Marketing", icon: MessageSquare },
      ].map((job, i) => (
        <motion.div 
          key={i}
          whileHover={{ y: -10 }}
          className="bg-zinc-900 border border-white/10 p-8 rounded-[2rem] hover:border-emerald-500/50 transition-all group"
        >
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-black transition-all">
            <job.icon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
          <div className="flex gap-3 mb-8">
            <span className="text-[10px] font-bold text-gray-500 uppercase px-2 py-1 bg-white/5 rounded-md">{job.type}</span>
            <span className="text-[10px] font-bold text-emerald-500 uppercase px-2 py-1 bg-emerald-500/10 rounded-md">{job.dept}</span>
          </div>
          <button type="button" onClick={() => alert("Application form opening...")} className="w-full py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white hover:text-black transition-all">
            Apply Now
          </button>
        </motion.div>
      ))}
    </div>

    <div className="bg-emerald-500 p-12 rounded-[3rem] text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[80px] rounded-full -mr-32 -mt-32" />
      <h2 className="text-4xl font-bold text-black mb-6 relative z-10">Don't see a role for you?</h2>
      <p className="text-black/70 max-w-xl mx-auto mb-10 font-medium relative z-10">We're always looking for exceptional talent. Send us your portfolio and tell us how you can contribute to the IFXTrades ecosystem.</p>
      <a href="mailto:careers@ifxtrades.com" className="inline-block px-10 py-4 bg-black text-white font-bold rounded-2xl hover:scale-105 transition-transform relative z-10">
        Send Open Application
      </a>
    </div>
  </div>
);
