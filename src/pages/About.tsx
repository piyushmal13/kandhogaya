import React from "react";

export const About = () => (
  <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
    <div className="text-center mb-20">
      <span className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em] mb-4 inline-block">About Us</span>
      <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">The IFXTrades Story</h1>
      <p className="text-gray-400 max-w-2xl mx-auto text-lg">We are a collective of institutional traders, quantitative developers, and market analysts dedicated to leveling the playing field for retail traders.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
      <div className="bg-zinc-900 border border-white/10 rounded-[3rem] p-12">
        <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
        <p className="text-gray-400 leading-relaxed mb-6">For too long, retail traders have been at a disadvantage against institutional algorithms and high-frequency trading firms. IFXTrades was founded to bridge this gap.</p>
        <p className="text-gray-400 leading-relaxed">By providing access to institutional-grade signals, advanced MT5 algorithmic bots, and elite education, we empower our community to trade with precision, discipline, and an undeniable edge.</p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {[
          { label: "Founded", value: "2020" },
          { label: "Global Team", value: "24+" },
          { label: "Countries", value: "110+" },
          { label: "Algorithms", value: "15+" }
        ].map((stat, i) => (
          <div key={i} className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl text-center">
            <div className="text-3xl font-bold text-emerald-500 mb-2">{stat.value}</div>
            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
