import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Briefcase, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Code2, 
  Database, 
  Sparkles, 
  Cpu, 
  FileText, 
  ChevronRight, 
  TrendingUp, 
  Building,
  Target,
  ArrowUpRight,
  Globe
} from "lucide-react";
import { PageMeta } from "../components/site/PageMeta";
import { useAuth } from "../contexts/AuthContext";
import { DashboardLayout } from "../components/institutional/DashboardLayout";
import { CRMService } from "../core/crmService";
import { useToast } from "../contexts/ToastContext";

// ── ELITE ROSTER DATA ──
const vettedQuants = [
  {
    id: "QUANT-88X",
    role: "Lead Machine Learning Quant",
    credentials: "Ex-Goldman Sachs Quant Team",
    specialty: "PyTorch Regime Detection & XAUUSD Neural Nets",
    metric: "Sharpe 3.42",
    experience: "8+ Years",
    languages: ["Python", "PyTorch", "C++"],
    status: "vetted"
  },
  {
    id: "ALGO-102Z",
    role: "C++ High-Frequency Developer",
    credentials: "Proprietary Fund Architect",
    specialty: "Ultra-Low Latency FIX Engines & Gold Arbitrage",
    metric: "Drawdown < 4.2%",
    experience: "6 Years",
    languages: ["C++", "Rust", "FIX Protocol"],
    status: "vetted"
  },
  {
    id: "QUANT-14Y",
    role: "SMC Strategy Engineer",
    credentials: "Algorithmic Risk Desk Head",
    specialty: "GARCH Volatility Modeling & SMC Execution Bridges",
    metric: "87.4% Win Rate",
    experience: "5+ Years",
    languages: ["Python", "PineScript", "MQL5"],
    status: "vetted"
  }
];

export const Academy = () => {
  const { user } = useAuth();
  const { toast: addToast } = useToast();
  
  // Tab states: 'clients' (Hire Talent) | 'quants' (Apply Vetting)
  const [activeTab, setActiveTab] = useState<"clients" | "quants">("clients");
  
  // Client Form State
  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    organization: "",
    roleRequired: "Execution Lead",
    budget: "$5,000 - $10,000",
    systemNeeds: ""
  });

  // Quant Form State
  const [quantForm, setQuantForm] = useState({
    name: "",
    email: "",
    primaryLang: "Python",
    experience: "3-5 Years",
    trackRecordUrl: "",
    strategyLogic: "",
    bio: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Recruiter submission handler
  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.name || !clientForm.email || !clientForm.organization) {
      addToast("Please fill in all primary fields.", "error");
      return;
    }
    setLoading(true);
    try {
      // capture B2B recruiter inquiry natively to leads schema in crm_metadata
      const res = await CRMService.captureLead(
        clientForm.email,
        "B2B_Recruitment_Inquiry",
        `B2B Hire Request: ${clientForm.roleRequired} at ${clientForm.organization}`,
        {
          client_name: clientForm.name,
          organization: clientForm.organization,
          role_required: clientForm.roleRequired,
          budget: clientForm.budget,
          system_needs: clientForm.systemNeeds
        }
      );
      
      if (res?.error) throw res.error;

      setSubmitted(true);
      addToast("B2B Talent Sourcing Request Logged Natively.", "success");
    } catch (err) {
      console.error(err);
      addToast("Signal connection interrupted. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Quant candidate submission handler
  const handleQuantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantForm.name || !quantForm.email || !quantForm.trackRecordUrl) {
      addToast("Please fill in name, email, and track record verification URL.", "error");
      return;
    }
    setLoading(true);
    try {
      // capture quant candidate application natively in leads schema under crm_metadata
      const res = await CRMService.captureLead(
        quantForm.email,
        "B2B_Talent_Network_Application",
        `Vetting Applied: ${quantForm.primaryLang} Quant (${quantForm.experience})`,
        {
          quant_name: quantForm.name,
          primary_lang: quantForm.primaryLang,
          experience: quantForm.experience,
          track_record_url: quantForm.trackRecordUrl,
          strategy_logic: quantForm.strategyLogic,
          bio: quantForm.bio
        }
      );
      
      if (res?.error) throw res.error;
      
      setSubmitted(true);
      addToast("Quantitative Candidate Application Filed Successfully.", "success");
    } catch (err) {
      console.error(err);
      addToast("Application filing failed. Please verify connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className={user ? "pb-24" : "pt-32 pb-24 md:pt-48 md:pb-48 bg-[#010203]"}>
      <PageMeta
        title="Global B2B Talent Desk | Algorithmic Vetting & Recruiting"
        description="Sourcing and vetting Asia's most elite algorithmic and quantitative forex trading talent. Connect direct with proprietary quants and custom system engineers."
        path="/academy"
        keywords={["quant hiring", "algo developers recruitment", "forex quants matchmaking", "vetted algorithmic developers"]}
      />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 space-y-16 md:space-y-32">
        {/* L1: Premium Institutional Hero */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 md:gap-20">
          <div className="space-y-8 flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/[0.04] border border-emerald-500/[0.15] text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              Enterprise Operations
            </motion.div>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-[-0.05em] leading-[0.85] uppercase italic">
              Global B2B <br />
              <span className="text-gradient-emerald">Talent Desk.</span>
            </h1>
            <p className="text-base md:text-xl text-white/40 max-w-2xl font-medium leading-relaxed mx-auto lg:mx-0">
              We scout, rigorously vet, and match the industry's top 1.5% algorithmic engineers, risk managers, and quant modelers with premier institutional capital desks globally.
            </p>
          </div>
          
          <div className="flex justify-center lg:justify-end gap-12 md:gap-16 border-t lg:border-t-0 lg:border-l border-white/5 pt-12 lg:pt-0 lg:pl-16">
             <div className="flex flex-col items-center lg:items-end">
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-3 leading-none">Vetted Quants</span>
                <span className="text-4xl md:text-6xl font-bold text-white font-mono">450+</span>
             </div>
             <div className="flex flex-col items-center lg:items-end">
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-3 leading-none">Scouting Rigor</span>
                <span className="text-4xl md:text-6xl font-bold text-emerald-500">Top 1.5%</span>
             </div>
          </div>
        </div>

        {/* L2: Institutional Vetted Roster Section */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Elite Vetted Spotlights (Anonymized Roster)</h2>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {vettedQuants.map((quant, index) => (
              <motion.article
                key={quant.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative flex flex-col justify-between p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/20 transition-all duration-300 shadow-xl overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity">
                  <Cpu size={80} />
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-emerald-400 font-mono tracking-wider">{quant.id}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                      Verified
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">{quant.role}</h3>
                    <p className="text-xs font-mono text-white/30">{quant.credentials}</p>
                  </div>

                  <p className="text-xs text-white/50 leading-relaxed font-light">
                    {quant.specialty}
                  </p>

                  <div className="flex items-center justify-between py-3 border-y border-white/5">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[10px] font-black text-white/60 font-mono">{quant.metric}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-cyan-500" />
                      <span className="text-[10px] font-black text-white/60 font-mono">{quant.experience} Exp</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {quant.languages.map(lang => (
                      <span key={lang} className="text-[9px] font-black text-white/40 uppercase tracking-widest bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-md">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <button 
                    onClick={() => {
                      setActiveTab("clients");
                      setClientForm(prev => ({
                        ...prev,
                        systemNeeds: `Interested in direct placement interview with candidate ${quant.id}.`
                      }));
                      window.scrollTo({
                        top: document.getElementById("talent-action-wizard")?.offsetTop || 0,
                        behavior: "smooth"
                      });
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-black text-white uppercase tracking-widest hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:text-emerald-400 transition-all duration-300"
                  >
                    Request Placement <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* L3: High Intent Onboarding Terminal Block */}
        <section id="talent-action-wizard" className="relative p-1 md:p-2 rounded-[3.5rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 shadow-2xl">
          <div className="p-8 md:p-16 rounded-[3.3rem] bg-[#020202] relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <div className="inline-flex rounded-full bg-white/[0.02] border border-white/10 p-1">
                  <button
                    onClick={() => { setActiveTab("clients"); setSubmitted(false); }}
                    className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === "clients" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                    }`}
                  >
                    <Building className="w-3 h-3 inline mr-2" />
                    Hire Talent (B2B)
                  </button>
                  <button
                    onClick={() => { setActiveTab("quants"); setSubmitted(false); }}
                    className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === "quants" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                    }`}
                  >
                    <Code2 className="w-3 h-3 inline mr-2" />
                    Quant Vetting Apply
                  </button>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter pt-4">
                  {activeTab === "clients" ? "Source Algorithmic Vetted Talent" : "Scale Your Algorithmic Career"}
                </h2>
                <p className="text-white/40 text-sm max-w-xl mx-auto">
                  {activeTab === "clients" 
                    ? "Let us know your quantitative profile requirements. Our desk will match candidates within 72 hours."
                    : "Pass our strict backtest verification and code architecture audit to join the B2B roster."}
                </p>
              </div>

              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 rounded-[2.5rem] bg-emerald-500/[0.02] border border-emerald-500/20 text-center space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Signal Action Logged Natively</h3>
                    <p className="text-xs font-mono text-emerald-500 uppercase tracking-widest">TRANSACTIONnominal_SECURED</p>
                  </div>
                  <p className="text-white/40 text-xs font-light max-w-md mx-auto leading-relaxed">
                    Your institutional inquiry has been processed and logged inside our CRM database leads container. One of our desk directors will contact you via secure email within 12 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Submit another secure record <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                  {activeTab === "clients" ? (
                    <motion.form
                      key="client-form"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      onSubmit={handleClientSubmit}
                      className="space-y-8"
                    >
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Client Contact Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Director of Trading"
                            value={clientForm.name}
                            onChange={e => setClientForm({...clientForm, name: e.target.value})}
                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/30 transition-all font-light"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Secure Corporate Email</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. desk@fundname.com"
                            value={clientForm.email}
                            onChange={e => setClientForm({...clientForm, email: e.target.value})}
                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/30 transition-all font-light"
                          />
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Organization Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Vertex Capital"
                            value={clientForm.organization}
                            onChange={e => setClientForm({...clientForm, organization: e.target.value})}
                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/30 transition-all font-light"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Quant Role Required</label>
                          <select
                            value={clientForm.roleRequired}
                            onChange={e => setClientForm({...clientForm, roleRequired: e.target.value})}
                            className="w-full bg-[#020202] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/30 transition-all font-light"
                          >
                            <option>Execution Lead</option>
                            <option>PineScript Specialist</option>
                            <option>Machine Learning Quant</option>
                            <option>Bespoke Custom System Engineer</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Monthly Allocation Cap</label>
                          <select
                            value={clientForm.budget}
                            onChange={e => setClientForm({...clientForm, budget: e.target.value})}
                            className="w-full bg-[#020202] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/30 transition-all font-light"
                          >
                            <option>$2,500 - $5,000</option>
                            <option>$5,000 - $10,000</option>
                            <option>$10,000+</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Quantitative System Specifications / Direct Instructions</label>
                        <textarea
                          placeholder="Please describe the core logic specifications, strategy constraints, or direct candidate placement needs..."
                          rows={4}
                          value={clientForm.systemNeeds}
                          onChange={e => setClientForm({...clientForm, systemNeeds: e.target.value})}
                          className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-emerald-500/30 transition-all font-light"
                        />
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-[10px] font-black text-black uppercase tracking-[0.25em] hover:bg-emerald-400 transition-colors shadow-lg disabled:opacity-50"
                        >
                          {loading ? "Filing Inquiry..." : "Log Sourcing Inquiry"} <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="quant-form"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      onSubmit={handleQuantSubmit}
                      className="space-y-8"
                    >
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Developer Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Piyush Malviya"
                            value={quantForm.name}
                            onChange={e => setQuantForm({...quantForm, name: e.target.value})}
                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/30 transition-all font-light"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Secure Contact Email</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. quant@ifxtrades.com"
                            value={quantForm.email}
                            onChange={e => setQuantForm({...quantForm, email: e.target.value})}
                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/30 transition-all font-light"
                          />
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Primary Language Core</label>
                          <select
                            value={quantForm.primaryLang}
                            onChange={e => setQuantForm({...quantForm, primaryLang: e.target.value})}
                            className="w-full bg-[#020202] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/30 transition-all font-light"
                          >
                            <option>Python</option>
                            <option>C++ / Rust</option>
                            <option>PineScript</option>
                            <option>MQL5 / MQL4</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Institutional Experience</label>
                          <select
                            value={quantForm.experience}
                            onChange={e => setQuantForm({...quantForm, experience: e.target.value})}
                            className="w-full bg-[#020202] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/30 transition-all font-light"
                          >
                            <option>1-3 Years</option>
                            <option>3-5 Years</option>
                            <option>5+ Years</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Verified Track Record URL</label>
                          <input
                            type="url"
                            required
                            placeholder="e.g. https://myfxbook.com/members/username"
                            value={quantForm.trackRecordUrl}
                            onChange={e => setQuantForm({...quantForm, trackRecordUrl: e.target.value})}
                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/30 transition-all font-light"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Primary Strategy Logic / Execution Architecture</label>
                        <textarea
                          placeholder="Describe the mathematical model, regime filters, stop management, and data ingestion structures utilized..."
                          rows={4}
                          value={quantForm.strategyLogic}
                          onChange={e => setQuantForm({...quantForm, strategyLogic: e.target.value})}
                          className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-emerald-500/30 transition-all font-light"
                        />
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-[10px] font-black text-black uppercase tracking-[0.25em] hover:bg-emerald-400 transition-colors shadow-lg disabled:opacity-50"
                        >
                          {loading ? "Submitting Application..." : "File Application Pipeline"} <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </section>

        {/* L4: Institutional Vetting Standards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 py-12 border-t border-white/5">
           <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6 hover:border-emerald-500/20 transition-all group">
              <div className="flex items-center justify-between">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Target className="w-6 h-6 text-emerald-400" />
                 </div>
                 <ArrowUpRight className="w-5 h-5 text-white/10 group-hover:text-emerald-500 transition-colors" />
              </div>
              <div className="space-y-2">
                 <h4 className="text-sm font-black text-white uppercase tracking-widest">Algorithmic Audits</h4>
                 <p className="text-sm font-light text-white/40 leading-relaxed">
                    We execute rigorous code complexity analyses, dynamic backtest fidelity stress audits under slippage models, and verified track record confirmations before cataloging any talent profile.
                 </p>
              </div>
           </div>
           <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6 hover:border-emerald-500/20 transition-all group">
              <div className="flex items-center justify-between">
                 <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <ShieldCheck className="w-6 h-6 text-purple-400" />
                 </div>
                 <ArrowUpRight className="w-5 h-5 text-white/10 group-hover:text-purple-500 transition-colors" />
              </div>
              <div className="space-y-2">
                 <h4 className="text-sm font-black text-white uppercase tracking-widest">Compliance & Privacy</h4>
                 <p className="text-sm font-light text-white/40 leading-relaxed">
                    All quantitative candidate placements occur under strict anonymized NDAs to protect proprietary systems, IP safeguards, and capital placement confidentiality.
                 </p>
              </div>
           </div>
        </section>
      </div>
    </div>
  );

  if (user) {
    return <DashboardLayout>{content}</DashboardLayout>;
  }

  return content;
};
