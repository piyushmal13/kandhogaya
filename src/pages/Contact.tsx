import React, { useState } from "react";
import { MessageSquare, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "../lib/supabase";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          { 
            full_name: formData.name, 
            email: formData.email, 
            subject: formData.subject, 
            message: formData.message,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      
      setStatus('success');
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch (err) {
      console.error("[Contact Form Error]:", err);
      setStatus('error');
    }
  };

  return (
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
          
          {status === 'success' ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
              <h4 className="text-2xl font-bold text-white mb-2">Message Received</h4>
              <p className="text-gray-400 mb-8">Our team will review your inquiry and get back to you within 24 hours.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Name</label>
                  <input 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
                    placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
                  <input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
                    placeholder="john@example.com" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subject</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500"
                >
                  <option>General Inquiry</option>
                  <option>Algo Licensing</option>
                  <option>Signal Subscription</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</label>
                <textarea 
                  required 
                  rows={4} 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
                  placeholder="How can we help you?" 
                />
              </div>
              
              {status === 'error' && (
                <p className="text-red-500 text-sm">Failed to send message. Please try again or contact support directly.</p>
              )}

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
