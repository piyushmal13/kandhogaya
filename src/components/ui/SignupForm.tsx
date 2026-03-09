import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { motion } from "motion/react";

export const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setStatus('loading');
    const { error } = await supabase.from('leads').insert({ email });
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setEmail("");
    }
  };

  return (
    <section className="py-24 bg-black border-t border-zinc-800">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join the Institutional Waitlist</h2>
        <p className="text-gray-400 mb-8">Get early access to our proprietary algorithms and market intelligence.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your corporate email"
            className="flex-1 px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            required
          />
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="px-8 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all"
          >
            {status === 'loading' ? 'Joining...' : 'Join Now'}
          </button>
        </form>
        {status === 'success' && <p className="text-emerald-500 mt-4">Thank you for joining!</p>}
        {status === 'error' && <p className="text-red-500 mt-4">Something went wrong. Please try again.</p>}
      </div>
    </section>
  );
};
