import React, { useState, useEffect } from "react";
import { Briefcase, ShieldCheck, ArrowRight, Building, Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { PageMeta } from "../components/site/PageMeta";
import { Reveal } from "../components/site/Reveal";
import { supabase } from "../lib/supabase";
import { EliteButton } from "../components/ui/Button";

export const BrokerTalent = () => {
  const [positions, setPositions] = useState<any[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(true);
  const [selectedPositionId, setSelectedPositionId] = useState<string>("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    trackRecord: "",
    portfolioLink: "",
    engagementType: "Full-Time Placement"
  });

  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [resumeName, setResumeName] = useState<string>("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileError, setFileError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [trackingId, setTrackingId] = useState("");

  // Fetch hiring positions for type 'broker_talent'
  useEffect(() => {
    const fetchPositions = async () => {
      setLoadingPositions(true);
      try {
        const { data, error } = await supabase
          .from("hiring_positions")
          .select("*")
          .eq("type", "broker_talent")
          .eq("is_active", true);

        if (!error && data) {
          setPositions(data);
          if (data.length > 0) {
            setSelectedPositionId(data[0].id);
          }
        }
      } catch (err) {
        console.error("Crash fetching broker talent positions:", err);
      } finally {
        setLoadingPositions(false);
      }
    };
    fetchPositions();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFileError("File exceeds 5MB limit.");
      return;
    }

    setUploadingFile(true);
    setFileError("");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("resumes")
        .getPublicUrl(filePath);

      setResumeUrl(publicUrl);
      setResumeName(file.name);
    } catch (err: any) {
      console.error("Resume transmission error:", err);
      setFileError(`Upload failed: ${err.message || err}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.trackRecord) {
      setSubmitError("Please fill out all required fields (*).");
      return;
    }
    if (!resumeUrl) {
      setSubmitError("Please upload a valid CV / Resume document.");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const generatedId = Math.random().toString(36).substring(2, 12).toUpperCase();

      const { error } = await supabase
        .from("hiring_applications")
        .insert([
          {
            position_id: selectedPositionId || null,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone || null,
            resume_url: resumeUrl,
            portfolio_url: formData.portfolioLink || null,
            cover_letter: formData.trackRecord,
            metadata: {
              engagement_type: formData.engagementType,
              tracking_id: `IFX-TAL-${generatedId}`,
              source: "b2b_broker_talent_portal",
              submitted_at: new Date().toISOString()
            }
          }
        ]);

      if (error) {
        setSubmitError(`System rejection: ${error.message}`);
      } else {
        setTrackingId(`IFX-TAL-${generatedId}`);
        setSubmitSuccess(true);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          trackRecord: "",
          portfolioLink: "",
          engagementType: "Full-Time Placement"
        });
        setResumeUrl("");
        setResumeName("");
      }
    } catch (err: any) {
      setSubmitError("An unexpected transmission anomaly occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#010203] text-[#BAC9CC] font-sans pb-24">
      <PageMeta
        title="Broker Talent Recruitment & Sourcing | B2B Services"
        description="Outsourced HR, talent acquisition, local training, and brokerage education programs for global partner brokerages."
        path="/broker-talent"
        keywords={["broker talent sourcing", "brokerage recruitment training", "HR support for brokers", "margin management education", "broker staffing"]}
      />

      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 md:pt-40 md:pb-20 border-b border-white/[0.03] bg-gradient-to-b from-[#010203] to-[#020203]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Reveal delay={0.05}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.25em] mb-8 font-mono">
              <Building className="h-3.5 w-3.5 text-cyan-400" /> B2B BROKER TALENT RECRUITMENT &amp; TRAINING DESK
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 uppercase italic">
              Sourcing &amp; Training Vetted <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">Brokerage Specialists</span>
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="text-lg md:text-xl text-[#8A9AAB] max-w-3xl mx-auto font-light leading-relaxed mb-12">
              Since 2019, we have spent 6-7 years building the industry's most trusted recruitment and training pipeline for brokerages. We identify top-tier customer support, sales, and technical specialists, train them on MT4/MT5 platforms, and manage all your staffing needs so you can focus on growth.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <a href="#vetting-form" className="w-full sm:w-auto">
                <EliteButton variant="elite" size="lg" fluid glowEffect rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Submit Staffing Application
                </EliteButton>
              </a>
              <a href="#active-roles" className="w-full sm:w-auto">
                <EliteButton variant="secondary" size="lg" fluid>
                  View Open Sourced Roles
                </EliteButton>
              </a>
            </div>
          </Reveal>

          {/* Quick Metrics */}
          <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto border border-white/[0.05] bg-[#040507]/40 backdrop-blur-md rounded-2xl p-8">
            <div className="text-center sm:text-left sm:border-r border-white/5 sm:pr-8">
              <div className="text-3xl font-extrabold text-white font-mono">100% Outsourced</div>
              <div className="text-[10px] uppercase tracking-widest text-[#849396] mt-2 font-mono">HR &amp; Lifecycle Management</div>
            </div>
            <div className="text-center sm:text-left sm:border-r border-white/5 sm:px-8">
              <div className="text-3xl font-extrabold text-white font-mono">Local Services</div>
              <div className="text-[10px] uppercase tracking-widest text-[#849396] mt-2 font-mono">Training &amp; Brokerage Education</div>
            </div>
            <div className="text-center sm:text-left sm:pl-8">
              <div className="text-3xl font-extrabold text-white font-mono">Vetted Placement</div>
              <div className="text-[10px] uppercase tracking-widest text-[#849396] mt-2 font-mono">Direct CRM Routing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-24">
        {/* Core Methodology */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal delay={0.1}>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest font-mono">
                <ShieldCheck className="h-4 w-4 text-cyan-400" /> B2B HUMAN RESOURCES &amp; SERVICES DIRECTIVE
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                6+ Years of Trusted Staffing &amp; Onboarding
              </h2>
              <p className="text-[#8A9AAB] leading-relaxed">
                Finding staff who understand commissions, spreads, customer service, and technical trading platforms is a major challenge for growing brokerages. Since 2019, our specialized sourcing desk has been recruiting, vetting, and training professionals so they can support your business operations immediately upon hire.
              </p>
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Local currency, rebate setup, and technical CRM training.
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Full outsourcing model with compliant HR management.
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Direct B2B partner brokerage integration and CRM syncing.
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="relative">
            <div className="site-panel p-8 relative overflow-hidden border border-blue-500/10 bg-[#040507]/40 backdrop-blur-md rounded-3xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider font-mono text-blue-400 border-b border-white/5 pb-3">
                // COMPREHENSIVE TEAM DEPLOYMENT
              </h3>
              <p className="text-xs font-mono text-white/70 leading-relaxed mb-6">
                "We help our corporate partners build reliable, trained teams. From platform support representatives to business developers, we handle compliance checks, system training, and local onboarding so you have a prepared workforce ready to go."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center text-xs font-bold text-blue-400 font-mono">
                  B2B
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Broker Staffing Desk</div>
                  <div className="text-[10px] text-[#849396] font-mono">IFX B2B SOURCING DEPT</div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Priority Talent Categories */}
        <section id="active-roles" className="space-y-12 scroll-mt-24">
          <Reveal>
            <div className="text-center space-y-4">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-widest font-mono">
                ACTIVE BROKER SOURCED ROLES
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Sourced Positions
              </h2>
              <p className="text-[#8A9AAB] max-w-2xl mx-auto">
                These vacancies are active on behalf of global brokerage partners. Submissions flow directly to partner HR review queues.
              </p>
            </div>
          </Reveal>

          {loadingPositions ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2].map((k) => (
                <div key={k} className="h-64 rounded-3xl bg-white/5 border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : positions.length === 0 ? (
            <div className="text-center py-12 rounded-3xl border border-white/5 bg-white/[0.01]">
              <p className="text-[#849396] text-xs font-mono uppercase tracking-widest">No active sourced roles registered in database.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {positions.map((pos, index) => (
                <Reveal key={pos.id} delay={index * 0.08} className="site-panel p-6 bg-[#040506]/80 hover:border-blue-500/20 border border-white/5 rounded-3xl transition-all duration-300">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-white tracking-tight">{pos.title}</h3>
                  <div className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider mt-1">{pos.department}</div>
                  <p className="mt-4 text-xs text-[#8A9AAB] leading-relaxed font-light">{pos.description}</p>
                  
                  {Array.isArray(pos.requirements) && pos.requirements.length > 0 && (
                    <div className="mt-4 space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-[#849396] font-mono">Core Metrics</span>
                      <ul className="list-disc pl-4 text-[10px] text-white/50 space-y-0.5">
                        {pos.requirements.slice(0, 3).map((req: string, rIdx: number) => (
                          <li key={rIdx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-6 border-t border-white/5 pt-4 flex justify-between items-center">
                    <div>
                      <div className="text-[9px] uppercase tracking-widest text-[#849396] font-mono">Location</div>
                      <div className="text-xs font-semibold text-white mt-0.5">{pos.location}</div>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedPositionId(pos.id);
                        document.getElementById("vetting-form")?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-mono text-[9px] uppercase tracking-widest font-black transition-all active:scale-95"
                    >
                      Apply Now
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </section>

        {/* Interactive Vetting Form Section */}
        <section id="vetting-form" className="scroll-mt-24">
          <Reveal className="site-panel p-8 md:p-12 relative overflow-hidden bg-gradient-to-b from-[#05070a]/90 to-[#020305]/95 border border-blue-500/15 rounded-3xl shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/[0.02] rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-3xl mx-auto">
              <div className="text-center space-y-4 mb-10">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-black uppercase tracking-widest font-mono">
                  SECURE B2B RECRUITMENT INGRESS // HR PIPELINE
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                  Apply for Broker Sourced Positions
                </h2>
                <p className="text-white/40 text-sm max-w-xl mx-auto leading-relaxed">
                  Apply for placements with global partner brokerage clients. Submissions flow directly to partner HR review queues.
                </p>
              </div>

              {submitSuccess ? (
                <div className="text-center py-12 px-6 rounded-2xl bg-blue-500/[0.02] border border-blue-500/20 max-w-2xl mx-auto">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">
                    Application Document Ingested
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto mb-8">
                    Your details and CV have been uploaded to our secure database records. The partner recruitment committee will evaluate your track record.
                  </p>
                  <div className="bg-black/40 border border-white/5 p-4 rounded-xl font-mono text-xs max-w-xs mx-auto">
                    <div className="text-[#849396] uppercase tracking-wider mb-1">Application ID</div>
                    <div className="text-blue-400 font-bold tracking-widest">{trackingId}</div>
                  </div>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-8 text-xs text-white/40 hover:text-white uppercase tracking-widest transition-colors font-mono underline"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitError && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-white/60 uppercase tracking-widest font-mono">
                        Full Legal Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Lawrence Vance"
                        className="w-full bg-[#090b0e] border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-black text-white/60 uppercase tracking-widest font-mono">
                        Secure Contact Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. vance@quantres.net"
                        className="w-full bg-[#090b0e] border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-white/60 uppercase tracking-widest font-mono">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +1 (555) 019-2834"
                        className="w-full bg-[#090b0e] border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-black text-white/60 uppercase tracking-widest font-mono">
                        Select Target Role *
                      </label>
                      <select
                        name="positionId"
                        value={selectedPositionId}
                        onChange={(e) => setSelectedPositionId(e.target.value)}
                        required
                        className="w-full bg-[#090b0e] border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors appearance-none"
                        style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%23BAC9CC\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem', backgroundRepeat: 'no-repeat' }}
                      >
                        <option value="">-- Choose Position --</option>
                        {positions.map((pos) => (
                          <option key={pos.id} value={pos.id}>{pos.title} ({pos.location})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* CV Upload Button */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-white/60 uppercase tracking-widest font-mono">
                      Upload CV / Resume Document (PDF / DOC) *
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <label className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[10px] font-black uppercase tracking-widest cursor-pointer active:scale-95 transition-all">
                        <Upload className="w-4 h-4 text-cyan-400" />
                        {uploadingFile ? "Uploading File..." : "Choose File"}
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          disabled={uploadingFile}
                          className="hidden"
                        />
                      </label>
                      {resumeName ? (
                        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                          <FileText className="w-4 h-4 shrink-0" />
                          <span>{resumeName}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-white/20 uppercase tracking-widest font-mono">No document uploaded yet</span>
                      )}
                    </div>
                    {fileError && <p className="text-xs text-red-400 font-mono">{fileError}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-white/60 uppercase tracking-widest font-mono">
                        GitHub / Portfolio URI (Optional)
                      </label>
                      <input
                        type="url"
                        name="portfolioLink"
                        value={formData.portfolioLink}
                        onChange={handleInputChange}
                        placeholder="e.g. https://github.com/brokerage-spec"
                        className="w-full bg-[#090b0e] border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-black text-white/60 uppercase tracking-widest font-mono">
                        Engagement Category
                      </label>
                      <select
                        name="engagementType"
                        value={formData.engagementType}
                        onChange={handleInputChange}
                        className="w-full bg-[#090b0e] border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors appearance-none"
                        style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%23BAC9CC\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem', backgroundRepeat: 'no-repeat' }}
                      >
                        <option value="Full-Time Placement">Full-Time Placement</option>
                        <option value="Temporary/Contract Staffing">Temporary/Contract Staffing</option>
                        <option value="HR Consulting / Training Program">HR Consulting / Training Program</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black text-white/60 uppercase tracking-widest font-mono">
                      Cover Letter / Sourcing Summary *
                    </label>
                    <textarea
                      name="trackRecord"
                      value={formData.trackRecord}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      placeholder="Briefly describe your training objectives, recruitment specifications, or relevant corporate background..."
                      className="w-full bg-[#090b0e] border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <EliteButton
                      type="submit"
                      disabled={isSubmitting || uploadingFile}
                      isLoading={isSubmitting}
                      variant="elite"
                      size="lg"
                      fluid
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Transmit Application Documents
                    </EliteButton>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
};
