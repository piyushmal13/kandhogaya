import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Check, ArrowRight, Activity, Calendar } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

import { Webinar } from '../../types';

interface RegistrationModalProps {
  webinar: Webinar;
  onClose: () => void;
  onSuccess: () => void;
}

export const RegistrationModal = ({ webinar, onClose, onSuccess }: RegistrationModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", country: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.full_name || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md p-8 text-center shadow-2xl"
        >
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Authentication Required</h3>
          <p className="text-gray-400 mb-8">
            Please log in to your account to register for this institutional webinar.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10">
              Cancel
            </button>
            <Link to="/login" className="flex-1 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 text-center">
              Log In
            </Link>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (webinar.is_paid) {
        // Redirect to payment gateway (simulated)
        setTimeout(() => {
          setLoading(false);
          setStep(2); // Payment success
        }, 2000);
      } else {
        // Free registration
        const { error: insertError } = await supabase
          .from('webinar_registrations')
          .insert([
            {
              webinar_id: webinar.id,
              user_id: user.id,
              attended: false
            }
          ]);

        if (insertError) throw insertError;

        // Update registration count
        await supabase
          .from('webinars')
          .update({ registration_count: webinar.registration_count + 1 })
          .eq('id', webinar.id);

        setLoading(false);
        setStep(3); // Success
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Registration error:", error);
      setError(error.message || "Failed to register. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-white/10 transition-colors text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 1 && (
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Secure Your Spot</h2>
              <p className="text-gray-400 text-sm">
                Register for <span className="text-emerald-400 font-bold">{webinar.title}</span>
              </p>
            </div>

            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Limited Availability</span>
              </div>
              <span className="text-sm font-bold text-white">
                Only {webinar.max_attendees - webinar.registration_count} seats remaining
              </span>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">
                    {new Date(webinar.date_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {new Date(webinar.date_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="text-gray-400 text-xs uppercase tracking-wider">Registration Fee</div>
                <div className="text-xl font-bold text-white">
                  {webinar.is_paid ? `$${webinar.price}` : "Free"}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1" htmlFor="fullName">Full Name</label>
                <input 
                  id="fullName"
                  required
                  type="text" 
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1" htmlFor="emailAddress">Email Address</label>
                <input 
                  id="emailAddress"
                  required
                  type="email" 
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1" htmlFor="country">Country</label>
                <input 
                  id="country"
                  required
                  type="text" 
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors"
                  value={formData.country}
                  onChange={e => setFormData({...formData, country: e.target.value})}
                  placeholder="e.g. United Arab Emirates"
                />
              </div>

              {error && (
                <div className="text-red-400 text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {webinar.is_paid ? "Proceed to Payment" : "Complete Registration"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-4 text-center text-[10px] text-gray-600">
              By registering, you agree to receive webinar reminders via email.
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Activity className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Processing Payment...</h3>
            <p className="text-gray-400 text-sm mb-6">
              Please complete the transaction in the secure window. Do not close this tab.
            </p>
            {/* Simulated Payment Success Button */}
            <button 
              onClick={() => setStep(3)}
              className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 text-sm"
            >
              Simulate Success
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Registration Confirmed!</h3>
            <p className="text-gray-400 text-sm mb-8">
              You have successfully registered for <strong>{webinar.title}</strong>. A confirmation email has been sent to {formData.email}.
            </p>
            
            <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/5 text-left">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Next Steps</div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Add to Calendar (Link in email)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Join 10 minutes early for sound check
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Prepare questions for Q&A
                </li>
              </ul>
            </div>

            <button 
              onClick={() => {
                onSuccess();
                onClose();
              }}
              className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
