import React from "react";
import { MessageSquare, Mail } from "lucide-react";

export const Contact = () => (
  <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
    <div className="text-center mb-20">
      <span className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em] mb-4 inline-block">Get in Touch</span>
      <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">Contact IFXTrades</h1>
      <p className="text-gray-400 max-w-2xl mx-auto text-lg">Have a question about our algorithms, signals, or enterprise solutions? Our support team is available 24/5.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 flex items-start gap-6">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <MessageSquare className="text-emerald-500 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">WhatsApp Support</h3>
            <p className="text-gray-400 text-sm mb-4">Fastest response time for active members and license inquiries.</p>
            <a href="https://wa.me/917709583224" target="_blank" rel="noreferrer" className="text-emerald-500 font-bold hover:underline">Chat with us →</a>
          </div>
        </div>
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 flex items-start gap-6">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Mail className="text-emerald-500 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
            <p className="text-gray-400 text-sm mb-4">For partnership inquiries, billing, and technical support.</p>
            <a href="mailto:support@ifxtrades.com" className="text-emerald-500 font-bold hover:underline">support@ifxtrades.com →</a>
          </div>
        </div>
      </div>
      <div className="bg-zinc-900 border border-white/10 rounded-[3rem] p-10">
        <h3 className="text-2xl font-bold text-white mb-8">Send a Message</h3>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Message sent! We'll get back to you shortly."); }}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Name</label>
              <input required className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
              <input required type="email" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" placeholder="john@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subject</label>
            <select className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500">
              <option>General Inquiry</option>
              <option>Algo Licensing</option>
              <option>Signal Subscription</option>
              <option>Partnership</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</label>
            <textarea required rows={4} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" placeholder="How can we help you?" />
          </div>
          <button type="submit" className="w-full py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all">
            Send Message
          </button>
        </form>
      </div>
    </div>
  </div>
);
