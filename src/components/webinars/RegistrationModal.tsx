import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Check, ArrowRight, Activity, Calendar } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { tracker } from "../../core/tracker";

import { Webinar } from '../../types';

interface RegistrationModalProps {
  webinar: Webinar;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RegistrationModal = ({ webinar, onClose, onSuccess }: RegistrationModalProps) => {
  const { user, userProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", country: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: userProfile?.full_name || "",
        email: user.email || ""
      }));
    }
  }, [user, userProfile]);

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

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Check if already registered
      const res = await supabase
        .from('webinar_registrations')
        .select('id')
        .eq('webinar_id', webinar.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (res?.data) {
        setStep(3); // Already registered success
        setLoading(false);
        return;
      }

      if (webinar.is_paid) {
        // Payment logic would go here
        setError("Paid webinars require a payment integration. Please contact support.");
        setLoading(false);
      } else {
        // 2. Insert registration
        const refCode = localStorage.getItem("ifx_referral_code");
        
        const { error: insertError } = await supabase
          .from('webinar_registrations')
          .insert([
            {
              webinar_id: webinar.id,
              user_id: user.id,
              email: formData.email,
              attended: false,
              payment_status: 'completed',
              referred_by_code: refCode
            }
          ]);

        if (insertError) throw insertError;

        // 3. Update webinar registration count
        const { error: updateError } = await supabase
          .from('webinars')
          .update({ 
            registration_count: (webinar.registration_count || 0) + 1 
          })
          .eq('id', webinar.id);

        if (updateError) console.error("Could not update count:", updateError);

        // 4. Upsert Lead in CRM
        const { error: leadError } = await supabase
          .from('leads')
          .upsert({
            id: user.id || undefined,
            name: formData.name || userProfile?.full_name || "Webinar Registrant",
            email: formData.email,
            status: "interested",
            source: "Webinar Registration",
            metadata: { 
              phone: formData.phone,
              country: formData.country,
              webinar_id: webinar.id,
              webinar_title: webinar.title
            }
          }, { onConflict: "email" });
          
        if (leadError) console.error("Could not add to leads CRM:", leadError);

        tracker.track("webinar_register", { webinar_id: webinar.id, title: webinar.title });
        setLoading(false);
        setStep(3); // Success
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register. Please try again.");
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
                <label className="block text-xs text-gray-500 mb-1" htmlFor="emailAddress">Email Address *</label>
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
                <label className="block text-xs text-gray-500 mb-1" htmlFor="phone">Phone Number *</label>
                <input 
                  id="phone"
                  required
                  type="tel" 
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1 (555) 000-0000"
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
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Next Steps</div>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-white">Save the Date to your Calendar</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 pl-6">
                    <a 
                      href={`https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(webinar.title)}&dates=${new Date(webinar.date_time).toISOString().replaceAll(/-|:|\.\d+/g, '')}/${new Date(new Date(webinar.date_time).getTime() + 60*60*1000).toISOString().replaceAll(/-|:|\.\d+/g, '')}&details=${encodeURIComponent(webinar.description || 'Institutional Trading Masterclass')}&location=Online`}
                      target="_blank" rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20 text-xs font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all text-center"
                    >
                      Google Calendar
                    </a>
                    <a 
                      href={`data:text/calendar;charset=utf-8,${encodeURIComponent([
                        'BEGIN:VCALENDAR',
                        'VERSION:2.0',
                        'BEGIN:VEVENT',
                         `DTSTART:${new Date(webinar.date_time).toISOString().replaceAll(/-|:|\.\d+/g, '')}`,
                         `DTEND:${new Date(new Date(webinar.date_time).getTime() + 60*60*1000).toISOString().replaceAll(/-|:|\.\d+/g, '')}`,
                         `SUMMARY:${webinar.title}`,
                         `DESCRIPTION:${webinar.description || 'Institutional Trading Masterclass'}`,
                         `LOCATION:Online`,
                        'END:VEVENT',
                        'END:VCALENDAR'
                      ].join('\n'))}`}
                      download={`${webinar.title.replaceAll(/[^a-z0-9]/gi, '_')}.ics`}
                      className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 text-xs font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all text-center"
                    >
                      Apple / Outlook (.ics)
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Join 10 minutes early for sound check
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Prepare questions for Q&A session
                </li>
              </ul>
            </div>

            <button 
              onClick={() => {
                if (onSuccess) onSuccess();
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
