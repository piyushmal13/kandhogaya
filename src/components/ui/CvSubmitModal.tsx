import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Upload, CheckCircle2, ShieldCheck, Mail, User, Briefcase, Lock, FileText, Phone, Globe, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { EliteButton } from "./Button";

interface CvSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CvSubmitModal: React.FC<CvSubmitModalProps> = ({ isOpen, onClose }) => {
  const [positions, setPositions] = useState<any[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileError, setFileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [trackingId, setTrackingId] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    portfolioLink: "",
    coverLetter: "",
    engagementType: "Core Quant Team Member",
    positionId: ""
  });
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeName, setResumeName] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const fetchPositions = async () => {
      setLoadingPositions(true);
      try {
        const { data, error } = await supabase
          .from("hiring_positions")
          .select("*")
          .eq("type", "internal")
          .eq("is_active", true);

        if (!error && data) {
          setPositions(data);
        }
      } catch (err) {
        console.error("Error loading positions:", err);
      } finally {
        setLoadingPositions(false);
      }
    };
    fetchPositions();
  }, [isOpen]);

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
      console.error("File upload error:", err);
      setFileError(`Upload failed: ${err.message || err}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !resumeUrl) {
      setSubmitError("Please fill out required fields and upload your CV.");
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
            position_id: formData.positionId || null,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone || null,
            resume_url: resumeUrl,
            portfolio_url: formData.portfolioLink || null,
            cover_letter: formData.coverLetter || "General CV drop from homepage",
            metadata: {
              engagement_type: formData.engagementType,
              tracking_id: `IFX-TAL-${generatedId}`,
              source: "homepage_quick_cv_modal",
              submitted_at: new Date().toISOString()
            }
          }
        ]);

      if (error) {
        setSubmitError(`System error: ${error.message}`);
      } else {
        setTrackingId(`IFX-TAL-${generatedId}`);
        setSubmitSuccess(true);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          portfolioLink: "",
          coverLetter: "",
          engagementType: "Core Quant Team Member",
          positionId: ""
        });
        setResumeUrl("");
        setResumeName("");
      }
    } catch (err: any) {
      setSubmitError("Unexpected transmission error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl max-h-[95svh] sm:max-h-[90vh] overflow-y-auto scrollbar-thin rounded-2xl sm:rounded-[2.5rem] bg-[#0A0A0A] p-5 sm:p-8 shadow-2xl z-10 border border-blue-500/10"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 p-2 rounded-full border border-white/5 bg-white/[0.02] text-white/40 hover:text-white hover:border-white/10 transition-all active:scale-95"
              aria-label="Close CV Modal"
            >
              <X className="h-4 w-4" />
            </button>

            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 shadow-[0_0_40px_rgba(0,163,255,0.2)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">CV Ingested</h3>
                <p className="text-white/40 text-sm max-w-sm leading-relaxed uppercase tracking-wider font-semibold mb-6">
                  Your credentials have been uploaded to our secure database. Our quantitative council will evaluate your record.
                </p>
                <div className="bg-black/40 border border-white/5 p-4 rounded-xl font-mono text-xs max-w-xs mx-auto">
                  <div className="text-[#849396] uppercase tracking-wider mb-1">Application ID</div>
                  <div className="text-blue-400 font-bold tracking-widest">{trackingId}</div>
                </div>
              </motion.div>
            ) : (
              <div>
                <div className="mb-8">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[8px] font-black uppercase tracking-[0.25em] mb-4">
                    <Lock className="w-2.5 h-2.5" /> SECURE QUANT DESK INGRESS
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter leading-none">
                    Submit Resume <br />
                    <span className="text-white/20">Join the Systematic Desk.</span>
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitError && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Full Legal Name *</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                        <input
                          required
                          type="text"
                          placeholder="e.g. Lawrence Vance"
                          className="w-full bg-black/60 border border-white/5 focus:border-blue-500/50 rounded-xl py-3 pl-10 pr-4 text-white outline-none transition-all font-mono text-xs"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Contact Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                        <input
                          required
                          type="email"
                          placeholder="e.g. vance@quantres.net"
                          className="w-full bg-black/60 border border-white/5 focus:border-blue-500/50 rounded-xl py-3 pl-10 pr-4 text-white outline-none transition-all font-mono text-xs"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Contact Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                        <input
                          type="tel"
                          placeholder="e.g. +1 555-0192"
                          className="w-full bg-black/60 border border-white/5 focus:border-blue-500/50 rounded-xl py-3 pl-10 pr-4 text-white outline-none transition-all font-mono text-xs"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Select Target Role</label>
                      <select
                        className="w-full bg-black/60 border border-white/5 focus:border-blue-500/50 rounded-xl py-3 px-4 text-white outline-none transition-all font-mono text-xs appearance-none"
                        value={formData.positionId}
                        onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                        style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%23BAC9CC\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem', backgroundRepeat: 'no-repeat' }}
                      >
                        <option value="">General Desk Application</option>
                        {positions.map((pos) => (
                          <option key={pos.id} value={pos.id}>{pos.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">GitHub / Portfolio URL</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                        <input
                          type="url"
                          placeholder="e.g. github.com/quant-dev"
                          className="w-full bg-black/60 border border-white/5 focus:border-blue-500/50 rounded-xl py-3 pl-10 pr-4 text-white outline-none transition-all font-mono text-xs"
                          value={formData.portfolioLink}
                          onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Engagement Type</label>
                      <select
                        className="w-full bg-black/60 border border-white/5 focus:border-blue-500/50 rounded-xl py-3 px-4 text-white outline-none transition-all font-mono text-xs appearance-none"
                        value={formData.engagementType}
                        onChange={(e) => setFormData({ ...formData, engagementType: e.target.value })}
                        style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%23BAC9CC\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem', backgroundRepeat: 'no-repeat' }}
                      >
                        <option value="Core Quant Team Member">Core Quant Team Member</option>
                        <option value="Contract Developer">Contract Developer</option>
                        <option value="Systematic Infrastructure Intern">Systematic Infrastructure Intern</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Upload Resume (PDF/DOC) *</label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5 text-cyan-400" />
                        {uploadingFile ? "Uploading..." : "Choose File"}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          disabled={uploadingFile}
                          className="hidden"
                        />
                      </label>
                      {resumeName ? (
                        <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                          <span>{resumeName}</span>
                        </div>
                      ) : (
                        <span className="text-[9px] text-white/20 uppercase tracking-widest font-mono">No file chosen</span>
                      )}
                    </div>
                    {fileError && <p className="text-[10px] text-red-400 font-mono mt-1">{fileError}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Brief Backtest Track Record / Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Highlight quantitative model performance, execution speed optimizations, or relevant engineering achievements..."
                      className="w-full bg-black/60 border border-white/5 rounded-2xl py-3 px-4 text-white outline-none focus:border-blue-500/50 transition-all font-mono text-xs resize-none"
                      value={formData.coverLetter}
                      onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    />
                  </div>

                  <EliteButton
                    type="submit"
                    variant="gemini"
                    size="lg"
                    className="w-full mt-2"
                    isLoading={isSubmitting}
                    disabled={isSubmitting || uploadingFile}
                    glowEffect
                  >
                    <span>Transmit CV Application</span>
                  </EliteButton>

                  <div className="flex items-center justify-center gap-1.5 pt-1 text-[8px] font-mono text-white/20 uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-500/50" />
                    <span>SECURE DIRECT DESK SUBMISSION</span>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
