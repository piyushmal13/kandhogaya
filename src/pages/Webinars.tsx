import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, PlayCircle, Video, TrendingUp, X, Globe, Check, Calendar } from "lucide-react";

export const Webinars = () => {
  const [webinars, setWebinars] = useState([]);
  const [selectedWebinar, setSelectedWebinar] = useState<any>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [regData, setRegData] = useState({ name: "", email: "" });

  useEffect(() => {
    fetch("/api/webinars")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setWebinars(data);
        } else {
          console.error("Failed to load webinars:", data);
          setWebinars([]);
        }
      })
      .catch(err => {
        console.error("Error fetching webinars:", err);
        setWebinars([]);
      });
  }, []);

  const generateGoogleCalendarUrl = (webinar: any) => {
    const start = new Date(webinar.start_time).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(new Date(webinar.start_time).getTime() + 3600000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const details = encodeURIComponent(`Join IFXTrades for: ${webinar.title}. Link will be sent to your email.`);
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(webinar.title)}&dates=${start}/${end}&details=${details}&location=Online&sf=true&output=xml`;
  };

  const generateICSFile = (webinar: any) => {
    const start = new Date(webinar.start_time).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(new Date(webinar.start_time).getTime() + 3600000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${webinar.title}`,
      `DESCRIPTION:Join IFXTrades for: ${webinar.title}`,
      "LOCATION:Online",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");
    
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${webinar.title.replace(/\s+/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true); // Keep modal open
    
    // Add loading state
    const submitBtn = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "Registering...";
    }

    try {
      const response = await fetch("/api/webinars/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webinar_id: selectedWebinar.id, ...regData })
      });
      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please try again.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = "Confirm Registration";
      }
    }
  };

  const Countdown = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState<any>({});

    useEffect(() => {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = new Date(targetDate).getTime() - now;
        
        if (distance < 0) {
          clearInterval(timer);
          setTimeLeft({ expired: true });
        } else {
          setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
          });
        }
      }, 1000);
      return () => clearInterval(timer);
    }, [targetDate]);

    if (timeLeft.expired) return <span className="text-red-500 font-bold">LIVE NOW</span>;

    return (
      <div className="flex gap-4 text-center">
        {['days', 'hours', 'minutes', 'seconds'].map(unit => (
          <div key={unit}>
            <div className="text-2xl font-bold text-white leading-none">{timeLeft[unit] || '00'}</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold">{unit[0]}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-emerald-500 font-bold text-xs uppercase tracking-widest mb-4 inline-block">Weekly Training</span>
        <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">IFXTrades Live Webinars</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Join our expert analysts every weekend for live market breakdowns, strategy sessions, and exclusive signal offers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {webinars.length > 0 ? webinars.map((web: any) => (
          <div key={web.id} className="bg-zinc-900 border border-white/10 rounded-3xl p-8 flex flex-col gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">
                <Users className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] text-white font-bold">1,240+ Registered</span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-48 h-48 bg-black rounded-2xl flex-shrink-0 flex items-center justify-center border border-white/5 relative overflow-hidden">
                <PlayCircle className="text-emerald-500 w-12 h-12 relative z-10 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-emerald-500/5" />
                <img src={`https://picsum.photos/seed/${web.id}/400/400`} className="absolute inset-0 w-full h-full object-cover opacity-20" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border border-black bg-zinc-800 overflow-hidden">
                        <img src={`https://picsum.photos/seed/user${i}/24/24`} alt="User" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">1,240+ Registered</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{web.title}</h3>
                <div className="mb-6">
                  <Countdown targetDate={web.start_time} />
                </div>
                <button 
                  type="button"
                  onClick={() => { setSelectedWebinar(web); setIsRegistering(true); }}
                  className="w-full md:w-auto px-8 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-zinc-900 rounded-3xl border border-dashed border-white/10">
            <Video className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <div className="text-gray-500 font-bold">No upcoming webinars scheduled.</div>
            <p className="text-gray-600 text-sm">Check back soon for our weekend market outlook.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isRegistering && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsRegistering(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-black w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Join Webinar</h2>
                    <p className="text-xs text-gray-500">Sponsored by IFXTrades Capital</p>
                  </div>
                </div>
                <button type="button" onClick={() => setIsRegistering(false)} className="text-gray-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-black/40 p-4 rounded-2xl border border-white/5 mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xs text-emerald-500 font-bold uppercase mb-1">Selected Session</div>
                    <div className="text-white font-bold">{selectedWebinar?.title}</div>
                    <div className="text-[10px] text-gray-500 mt-1">{new Date(selectedWebinar?.start_time).toLocaleString()}</div>
                  </div>
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-white/10">
                    <Globe className="text-gray-600 w-6 h-6" />
                  </div>
                </div>
              </div>

              {!isSuccess ? (
                <form className="space-y-4" onSubmit={handleRegister}>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Full Name</label>
                    <input 
                      required 
                      value={regData.name}
                      onChange={(e) => setRegData({...regData, name: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Email Address</label>
                    <input 
                      required 
                      type="email" 
                      value={regData.email}
                      onChange={(e) => setRegData({...regData, email: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
                      placeholder="john@example.com" 
                    />
                  </div>
                  <button type="submit" className="w-full py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg disabled:opacity-50">
                    Confirm Registration
                  </button>
                  <p className="text-[10px] text-gray-600 text-center">By registering, you agree to receive email reminders and exclusive offers from IFXTrades.</p>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="text-emerald-500 w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">You're In!</h3>
                  <p className="text-gray-400 text-sm mb-8">We've sent a confirmation email to <span className="text-white">{regData.email}</span> with your access link.</p>
                  
                  <div className="space-y-3">
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-4">Add to Calendar</div>
                    <div className="grid grid-cols-2 gap-3">
                      <a 
                        href={generateGoogleCalendarUrl(selectedWebinar)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold hover:bg-white/10 transition-all"
                      >
                        <Calendar className="w-4 h-4" /> Google
                      </a>
                      <button 
                        type="button"
                        onClick={() => generateICSFile(selectedWebinar)}
                        className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold hover:bg-white/10 transition-all"
                      >
                        <Calendar className="w-4 h-4" /> iCal / Outlook
                      </button>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => { setIsRegistering(false); setIsSuccess(false); }}
                    className="mt-8 text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
