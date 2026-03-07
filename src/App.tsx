import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, LayoutDashboard, BookOpen, Video, Settings, ShieldCheck, 
  Menu, X, ChevronRight, ArrowUpRight, Zap, BarChart3, Globe, Users, 
  LogOut, ShoppingCart, PlayCircle, MessageSquare, Bell, Search, Filter,
  Star, Clock, Mail, Phone, Instagram, Twitter, Youtube, Briefcase,
  CheckCircle2, Award, Target
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { supabase } from "./lib/supabase";

// --- AUTH CONTEXT ---
const AuthContext = createContext<any>(null);
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Login error:", error.message);
      return false;
    }
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// --- COMPONENTS ---

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Signals", path: "/signals", icon: Zap },
    { name: "Algos", path: "/marketplace", icon: BarChart3 },
    { name: "Results", path: "/results", icon: Target },
    { name: "Academy", path: "/courses", icon: BookOpen },
    { name: "Webinars", path: "/webinars", icon: Video },
    { name: "Blog", path: "/blog", icon: MessageSquare },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform overflow-hidden">
              <img src="/assets/logo.png" alt="IFXTrades" className="w-full h-full object-cover hidden" />
              <TrendingUp className="text-black w-5 h-5" />
            </div>
            <span className="text-white font-bold tracking-tight text-lg">IFXTrades</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-emerald-400",
                  location.pathname === link.path ? "text-emerald-400" : "text-gray-400"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-4 border-l border-white/10 pl-8">
              <Link to="/hiring" className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full hover:bg-emerald-500 hover:text-black transition-all">
                <Briefcase className="w-3 h-3" />
                Hiring
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                  {(user.email === 'admin@ifxtrades.com' || user.email === 'admin@tradinghub.com' || user.user_metadata?.role === 'admin') && (
                    <Link to="/admin" className="text-gray-400 hover:text-white transition-colors">
                      <Settings className="w-5 h-5" />
                    </Link>
                  )}
                  <button onClick={logout} className="text-gray-400 hover:text-red-400 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <Link to="/login" className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-emerald-400 transition-all">
                  Sign In
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const SuccessShowcase = () => {
  const stats = [
    { label: "Pips Gained", value: "48,250+", icon: TrendingUp, suffix: " pips" },
    { label: "Success Rate", value: "82.4", icon: Award, suffix: "%" },
    { label: "Active Traders", value: "12,400", icon: Users, suffix: "+" },
    { label: "Total Payouts", value: "$2.4M", icon: ShoppingCart, suffix: "" },
  ];

  return (
    <section className="py-32 bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#10b98108,transparent_70%)]" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">Proven Results. Elite Community.</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">We don't just talk about trading. We live it. Join thousands of traders who have found their edge with IFXTrades.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900/50 border border-white/5 p-10 rounded-[3rem] text-center backdrop-blur-sm hover:border-emerald-500/30 transition-all group"
            >
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                <item.icon className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold text-white mb-2 tracking-tighter">
                {item.value}{item.suffix}
              </div>
              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-black border-t border-white/5 pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-black w-5 h-5" />
            </div>
            <span className="text-white font-bold tracking-tight text-xl">IFXTrades</span>
          </Link>
          <p className="text-gray-500 max-w-sm mb-8">
            The Operating System for Retail Traders. Empowering the next generation of traders with institutional-grade intelligence and automated solutions.
          </p>
          <div className="flex gap-4">
            {[Instagram, Twitter, Youtube, Mail].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-black transition-all">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Ecosystem</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><Link to="/signals" className="hover:text-emerald-500 transition-colors">Trading Signals</Link></li>
            <li><Link to="/marketplace" className="hover:text-emerald-500 transition-colors">Algo Marketplace</Link></li>
            <li><Link to="/courses" className="hover:text-emerald-500 transition-colors">Trading Academy</Link></li>
            <li><Link to="/webinars" className="hover:text-emerald-500 transition-colors">Live Webinars</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><Link to="/blog" className="hover:text-emerald-500 transition-colors">Market Insights</Link></li>
            <li><Link to="/hiring" className="hover:text-emerald-500 transition-colors">Join the Team</Link></li>
            <li><Link to="/support" className="hover:text-emerald-500 transition-colors">Help Center</Link></li>
            <li><Link to="/legal" className="hover:text-emerald-500 transition-colors">Risk Disclosure</Link></li>
          </ul>
        </div>
      </div>
      <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-xs text-gray-600">© 2026 IFXTrades Trading Intelligence Hub. All rights reserved.</div>
        <div className="flex gap-8 text-xs text-gray-600">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

const WhatsAppButton = () => (
  <a 
    href="https://wa.me/917709583224" 
    target="_blank" 
    rel="noopener noreferrer"
    className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-110 transition-transform group"
  >
    <MessageSquare className="text-black w-8 h-8" />
    <span className="absolute right-full mr-4 bg-zinc-900 text-white text-[10px] font-bold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
      Chat with Support
    </span>
  </a>
);

// --- PAGES ---

const Results = () => {
  const data = [
    { month: 'Oct', pips: 4200 },
    { month: 'Nov', pips: 3800 },
    { month: 'Dec', pips: 5100 },
    { month: 'Jan', pips: 4800 },
    { month: 'Feb', pips: 6200 },
    { month: 'Mar', pips: 5800 },
  ];

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <span className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em] mb-4 inline-block">Track Record</span>
        <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">Institutional Performance</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">Transparency is our core value. View our verified trading performance across all IFXTrades ecosystems.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        <div className="lg:col-span-2 bg-zinc-900 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10">
            <div className="text-emerald-500 font-bold text-4xl tracking-tighter">+48,250 Pips</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest text-right">Total Gain (LTM)</div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-10">Equity Growth Curve</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPips" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="pips" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorPips)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8">
          {[
            { label: "Win Rate", value: "82.4%", icon: Target, color: "text-emerald-500" },
            { label: "Profit Factor", value: "3.24", icon: TrendingUp, color: "text-white" },
            { label: "Avg. Risk/Reward", value: "1:3.5", icon: ShieldCheck, color: "text-emerald-500" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] flex items-center gap-6"
            >
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center">
                <stat.icon className={cn("w-7 h-7", stat.color)} />
              </div>
              <div>
                <div className="text-3xl font-bold text-white tracking-tighter">{stat.value}</div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-emerald-500 p-12 rounded-[3rem] group">
          <Award className="text-black w-12 h-12 mb-6 group-hover:rotate-12 transition-transform" />
          <h3 className="text-3xl font-bold text-black mb-4 tracking-tight">Verified by MyFxBook</h3>
          <p className="text-black/70 mb-8 font-medium">Our results are audited and verified by third-party platforms to ensure 100% transparency for our community.</p>
          <button className="px-8 py-4 bg-black text-white font-bold rounded-2xl hover:scale-105 transition-transform">
            View Public Audit
          </button>
        </div>
        <div className="bg-zinc-900 border border-white/10 p-12 rounded-[3rem]">
          <CheckCircle2 className="text-emerald-500 w-12 h-12 mb-6" />
          <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Join the Winners</h3>
          <p className="text-gray-500 mb-8">Stop guessing. Start following the data. Join 12,000+ traders who use IFXTrades to secure their edge.</p>
          <Link to="/login" className="inline-block px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-emerald-500 transition-all">
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};
const Academy = () => {
  const courses = [
    { id: 1, title: "Forex Mastery 101", level: "Beginner", duration: "12 Hours", lessons: 24, image: "https://picsum.photos/seed/forex/800/450" },
    { id: 2, title: "Gold Scalping Secrets", level: "Advanced", duration: "8 Hours", lessons: 15, image: "https://picsum.photos/seed/gold/800/450" },
    { id: 3, title: "Algo Trading with MT5", level: "Intermediate", duration: "15 Hours", lessons: 30, image: "https://picsum.photos/seed/algo/800/450" },
  ];

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-20">
        <span className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em] mb-4 inline-block">Education</span>
        <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">IFXTrades Academy</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">Master the markets with our structured learning paths. From basic pips to advanced algorithmic strategies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {courses.map((course, i) => (
          <motion.div 
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-emerald-500/50 transition-all"
          >
            <div className="aspect-video relative overflow-hidden">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-emerald-500 text-[10px] font-bold rounded-full border border-white/10 uppercase tracking-widest">
                  {course.level}
                </span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-500 transition-colors">{course.title}</h3>
              <div className="flex items-center gap-6 mb-8 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {course.duration}</div>
                <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> {course.lessons} Lessons</div>
              </div>
              <button className="w-full py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white hover:text-black transition-all">
                Start Learning
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Home = () => (
  <div className="bg-black min-h-screen relative overflow-hidden">
    {/* GFX: Background Ambient Glows */}
    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full" />
    
    <section className="relative pt-40 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-10 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          >
            IFXTrades INTELLIGENCE HUB
          </motion.span>
          <h1 className="text-7xl md:text-9xl font-bold text-white tracking-tighter leading-[0.85] mb-12">
            THE OPERATING <br /> SYSTEM FOR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 italic">RETAIL TRADERS</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed">
            Institutional-grade signals, automated gold algorithms, and elite forex education. <br className="hidden md:block" /> Built for the modern trader who demands precision.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link to="/signals" className="group relative px-10 py-5 bg-emerald-500 text-black font-bold rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <span className="relative z-10 flex items-center gap-2">
                View Live Signals <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </Link>
            <Link to="/marketplace" className="px-10 py-5 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all backdrop-blur-xl">
              Explore Algos
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    <SuccessShowcase />

    <section className="py-32 bg-black relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
          {[
            { label: "Active Traders", value: "24,000+", color: "text-emerald-500" },
            { label: "Signal Accuracy", value: "82.4%", color: "text-white" },
            { label: "Algo Volume", value: "$4.2B", color: "text-emerald-500" },
            { label: "Expert Mentors", value: "12", color: "text-white" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className={cn("text-5xl font-bold mb-4 tracking-tighter", stat.color)}>{stat.value}</div>
              <div className="text-[10px] text-gray-600 uppercase tracking-[0.3em] font-bold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

const Hiring = () => (
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
          <button className="w-full py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white hover:text-black transition-all">
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

const Signals = () => {
  const [signals, setSignals] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ accuracy: "82.4%", total: 142, pips: "+4,250" });

  useEffect(() => {
    fetch("/api/content?type=signal").then(r => r.json()).then(setSignals);
    // Mock history for now
    setHistory([
      { id: 1, title: "XAUUSD SELL", result: "TP Hit", pips: "+120", date: "2024-03-06" },
      { id: 2, title: "EURUSD BUY", result: "TP Hit", pips: "+45", date: "2024-03-05" },
      { id: 3, title: "GBPUSD SELL", result: "SL Hit", pips: "-30", date: "2024-03-04" },
    ]);
  }, []);

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Signals Dashboard</h1>
          <p className="text-gray-400">Institutional-grade setups from the IFXTrades analyst team.</p>
        </div>
        <div className="flex gap-4">
          {Object.entries(stats).map(([key, val]) => (
            <div key={key} className="bg-zinc-900 border border-white/5 px-4 py-2 rounded-xl">
              <div className="text-[10px] text-gray-500 uppercase font-bold">{key}</div>
              <div className="text-emerald-500 font-bold">{val}</div>
            </div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="text-emerald-500 w-5 h-5" /> Live Setups
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {signals.map((sig: any) => (
              <div key={sig.id} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/50 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-white font-bold">{sig.title}</h3>
                    <span className="text-[10px] text-emerald-500 font-bold uppercase">Active Setup</span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">{new Date(sig.published_at).toLocaleTimeString()}</span>
                </div>
                <div className="space-y-4 mb-8 bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Entry</span>
                    <span className="text-white font-mono">{sig.data.entry}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Target (TP)</span>
                    <span className="text-emerald-400 font-bold font-mono">{sig.data.tp}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Risk (SL)</span>
                    <span className="text-red-400 font-mono">{sig.data.sl}</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-emerald-500 text-black text-sm font-bold rounded-xl hover:bg-emerald-400 transition-all">
                  Copy Parameters
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="text-gray-400 w-5 h-5" /> Performance History
          </h2>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
            {history.map((item: any) => (
              <div key={item.id} className="p-4 border-b border-white/5 flex justify-between items-center hover:bg-white/5 transition-colors">
                <div>
                  <div className="text-sm font-bold text-white">{item.title}</div>
                  <div className="text-[10px] text-gray-500">{item.date}</div>
                </div>
                <div className="text-right">
                  <div className={cn("text-xs font-bold", item.result === "TP Hit" ? "text-emerald-500" : "text-red-500")}>
                    {item.result}
                  </div>
                  <div className="text-xs text-white font-mono">{item.pips} pips</div>
                </div>
              </div>
            ))}
            <button className="w-full py-3 text-xs text-gray-500 hover:text-white transition-colors">
              View Full Track Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(setProducts);
  }, []);

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Algo Marketplace</h1>
        <p className="text-gray-400">Institutional-grade trading bots for MT5. Rent the edge.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.filter((p: any) => p.type === 'algo_bot').map((bot: any) => (
          <div key={bot.id} className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="aspect-video bg-black relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-10" />
              <img src={`https://picsum.photos/seed/${bot.name}/800/450`} alt={bot.name} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute bottom-4 left-6 z-20">
                <span className="px-3 py-1 bg-emerald-500 text-black text-[10px] font-bold rounded-full uppercase mb-2 inline-block">MT5 Compatible</span>
                <h3 className="text-2xl font-bold text-white">{bot.name}</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-400 text-sm line-clamp-2">{bot.description || "Advanced algorithmic trading system optimized for XAUUSD and major forex pairs."}</p>
                <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  <Star className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                  <span className="text-[10px] text-emerald-500 font-bold">4.9</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-8">
                {bot.variants?.map((v: any) => (
                  <div key={v.id} className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5 hover:border-emerald-500/20 transition-all cursor-pointer">
                    <div>
                      <div className="text-white font-bold text-sm">{v.name}</div>
                      <div className="text-[10px] text-gray-500">Full License Support</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-500 font-bold">${v.price}</div>
                      <div className="text-[10px] text-gray-500">/ month</div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-emerald-500 transition-all">
                Get License Key
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (isOtpMode) {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) alert(error.message);
      else setOtpSent(true);
    } else {
      if (await login(email, password)) navigate("/dashboard");
      else alert("Login failed. Check your credentials.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#10b98110,transparent_70%)]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <TrendingUp className="text-black w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">IFXTrades Hub</h2>
          <p className="text-gray-500 text-sm">Access the Operating System for Retail Traders</p>
        </div>

        <div className="space-y-6">
          <button 
            onClick={handleGoogleLogin}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all shadow-lg"
          >
            <Globe className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="flex items-center gap-4">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[10px] text-gray-600 font-bold uppercase">or continue with email</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1">Email Address</label>
              <input 
                required
                type="email"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500 transition-all" 
                placeholder="name@company.com"
              />
            </div>
            
            {!isOtpMode && (
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1">Password</label>
                <input 
                  required
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500 transition-all" 
                  placeholder="••••••••"
                />
              </div>
            )}

            {otpSent && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-xs font-bold text-center">
                Magic link sent! Check your email to login.
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full py-4 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? "Processing..." : (isOtpMode ? "Send Magic Link" : "Sign In to Hub")}
            </button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => setIsOtpMode(!isOtpMode)}
              className="text-xs text-gray-500 hover:text-emerald-500 transition-colors font-bold"
            >
              {isOtpMode ? "Use Password Instead" : "Login with Magic Link (OTP)"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-white">Welcome, {user.user_metadata?.full_name || user.email}</h1>
        <div className="flex gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg">
            <span className="text-xs text-emerald-500 font-bold uppercase">Pro Member</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Active Subscriptions</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                  <Zap className="text-emerald-500" />
                  <div>
                    <div className="text-white font-bold">Elite Signals</div>
                    <div className="text-xs text-gray-500">Renews on Dec 31, 2024</div>
                  </div>
                </div>
                <button className="text-xs text-gray-400 hover:text-white">Manage</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center gap-2 p-4 bg-black rounded-xl border border-white/5 hover:border-emerald-500/50 transition-all">
                <ShieldCheck className="text-emerald-500" />
                <span className="text-xs text-white">Licenses</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-black rounded-xl border border-white/5 hover:border-emerald-500/50 transition-all">
                <Bell className="text-emerald-500" />
                <span className="text-xs text-white">Alerts</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("content");
  const [stats, setStats] = useState<any>(null);
  
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("signal");
  
  const [licenseUserId, setLicenseUserId] = useState("");
  const [licenseAlgoId, setLicenseAlgoId] = useState("");
  const [licenseKey, setLicenseKey] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats").then(r => r.json()).then(setStats);
  }, []);

  const isAdmin = user?.email === 'admin@ifxtrades.com' || user?.email === 'admin@tradinghub.com' || user?.user_metadata?.role === 'admin';
  if (!user || !isAdmin) return <Navigate to="/" />;

  const handlePublish = async (e: any) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token}`
      },
      body: JSON.stringify({ title, content_type: type, body, data: { entry: 2150, sl: 2140, tp: 2170 } })
    });
    if (res.ok) {
      alert("Published!");
      setTitle("");
      setBody("");
    }
  };

  const handleGenerateLicense = async (e: any) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/admin/licenses", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token}`
      },
      body: JSON.stringify({ user_id: licenseUserId, algo_id: licenseAlgoId, duration_days: 30 })
    });
    if (res.ok) {
      const data = await res.json();
      setLicenseKey(data.license_key);
      alert("License Generated!");
    }
  };

  const tabs = [
    { id: "stats", name: "Analytics", icon: BarChart3 },
    { id: "content", name: "Publishing", icon: Zap },
    { id: "licenses", name: "Licenses", icon: ShieldCheck },
    { id: "users", name: "Users", icon: Users },
  ];

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-white">IFXTrades Control Center</h1>
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                activeTab === tab.id ? "bg-emerald-500 text-black shadow-lg" : "text-gray-400 hover:text-white"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeTab === "stats" && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Total Traders", value: stats.total_users, icon: Users },
              { label: "Active Subs", value: stats.active_subscriptions, icon: ShieldCheck },
              { label: "Revenue (MTD)", value: `$${stats.revenue_mtd}`, icon: ShoppingCart },
              { label: "Signal Accuracy", value: stats.signal_accuracy, icon: Zap },
            ].map((s, i) => (
              <div key={i} className="bg-zinc-900 border border-white/10 p-6 rounded-2xl">
                <s.icon className="text-emerald-500 w-6 h-6 mb-4" />
                <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "content" && (
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-3xl">
            <h2 className="text-xl font-bold text-white mb-6">Quick Publish Content</h2>
            <form onSubmit={handlePublish} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Title</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Type</label>
                  <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500">
                    <option value="signal">Signal</option>
                    <option value="blog">Blog Post</option>
                    <option value="market_report">Market Report</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Body / Analysis</label>
                <textarea rows={5} value={body} onChange={e => setBody(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" />
              </div>
              <button className="w-full py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all">
                Publish to Hub
              </button>
            </form>
          </div>
        )}

        {activeTab === "licenses" && (
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-3xl">
            <h2 className="text-xl font-bold text-white mb-6">Generate Bot License</h2>
            <form onSubmit={handleGenerateLicense} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">User ID (UUID)</label>
                  <input value={licenseUserId} onChange={e => setLicenseUserId(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" placeholder="Paste Supabase User ID" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Algo Bot ID</label>
                  <input value={licenseAlgoId} onChange={e => setLicenseAlgoId(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" placeholder="Paste Bot ID" />
                </div>
              </div>
              {licenseKey && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="text-[10px] text-emerald-500 font-bold uppercase mb-1">Generated Key (Send via WhatsApp)</div>
                  <div className="text-white font-mono font-bold select-all">{licenseKey}</div>
                </div>
              )}
              <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-emerald-500 transition-all">
                Generate & Save License
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const Webinars = () => {
  const [webinars, setWebinars] = useState([]);
  const [selectedWebinar, setSelectedWebinar] = useState<any>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    fetch("/api/webinars").then(r => r.json()).then(setWebinars);
  }, []);

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
                <button onClick={() => setIsRegistering(false)} className="text-gray-500 hover:text-white">
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
                    <img src="/assets/logo.png" alt="Sponsor" className="w-full h-full object-cover hidden" />
                    <Globe className="text-gray-600 w-6 h-6" />
                  </div>
                </div>
              </div>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Invitation sent to your email!"); setIsRegistering(false); }}>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Full Name</label>
                  <input required className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Email Address</label>
                  <input required type="email" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" placeholder="john@example.com" />
                </div>
                <button className="w-full py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg">
                  Confirm Registration
                </button>
                <p className="text-[10px] text-gray-600 text-center">By registering, you agree to receive email reminders and exclusive offers from IFXTrades.</p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("/api/content?type=blog").then(r => r.json()).then(setPosts);
  }, []);

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Market Insights</h1>
        <p className="text-gray-400">Expert analysis on Forex, Gold, and Global Macro markets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: any) => (
          <Link key={post.id} to={`/blog/${post.slug}`} className="group">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all">
              <div className="aspect-video bg-black overflow-hidden">
                <img src={`https://picsum.photos/seed/${post.slug}/800/450`} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="p-6">
                <div className="text-[10px] text-emerald-500 font-bold uppercase mb-2 tracking-widest">Market Analysis</div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-500 transition-colors">{post.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-3 mb-6">{post.body}</p>
                <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase">
                  <span>{new Date(post.published_at).toLocaleDateString()}</span>
                  <span>5 min read</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const BlogDetail = () => {
  const { slug } = useLocation().pathname.split("/").pop() as any;
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/content?type=blog`).then(r => r.json()).then(posts => {
      const p = posts.find((x: any) => x.slug === slug);
      setPost(p);
    });
  }, [slug]);

  if (!post) return <div className="pt-32 text-center text-white">Loading...</div>;

  return (
    <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto">
      <Link to="/blog" className="text-emerald-500 text-sm font-bold flex items-center gap-2 mb-8 hover:translate-x-[-4px] transition-transform">
        <ArrowUpRight className="rotate-[225deg] w-4 h-4" /> Back to Insights
      </Link>
      <div className="text-[10px] text-emerald-500 font-bold uppercase mb-4 tracking-widest">Market Analysis</div>
      <h1 className="text-5xl font-bold text-white mb-8 tracking-tight leading-tight">{post.title}</h1>
      <div className="flex items-center gap-4 mb-12 pb-12 border-b border-white/10">
        <div className="w-10 h-10 bg-emerald-500 rounded-full" />
        <div>
          <div className="text-white font-bold text-sm">IFXTrades Analyst Team</div>
          <div className="text-xs text-gray-500">{new Date(post.published_at).toLocaleDateString()} • 5 min read</div>
        </div>
      </div>
      <div className="prose prose-invert max-w-none">
        <div className="text-xl text-gray-300 leading-relaxed mb-8">
          <ReactMarkdown>
            {post.body}
          </ReactMarkdown>
        </div>
        <div className="bg-zinc-900 p-8 rounded-3xl border border-white/10 mb-8">
          <h3 className="text-white font-bold mb-4">Key Takeaways</h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="flex items-start gap-2"><Zap className="text-emerald-500 w-4 h-4 mt-1 flex-shrink-0" /> Monitor XAUUSD support at 2150.</li>
            <li className="flex items-start gap-2"><Zap className="text-emerald-500 w-4 h-4 mt-1 flex-shrink-0" /> Weekly trend remains bullish on H4 timeframe.</li>
            <li className="flex items-start gap-2"><Zap className="text-emerald-500 w-4 h-4 mt-1 flex-shrink-0" /> Macro volatility expected after NFP release.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-black min-h-screen font-sans selection:bg-emerald-500 selection:text-black">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signals" element={<Signals />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/results" element={<Results />} />
              <Route path="/courses" element={<Academy />} />
              <Route path="/webinars" element={<Webinars />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/hiring" element={<Hiring />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </Router>
    </AuthProvider>
  );
}
