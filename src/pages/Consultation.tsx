import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Phone, Calendar, ArrowRight } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { PageMeta } from '../components/site/PageMeta';
import { supabase } from '../lib/supabase';
import { institutionalVariants } from '../lib/motion';
import { Button as SovereignButton } from '../components/ui/Button';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  strategy: string;
  platform: string;
  budget: string;
}

const INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl bg-[#0a0d14] border border-white/10 text-white placeholder-white/20 focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/20 outline-none transition-all duration-200 text-sm';

const LABEL_CLASS =
  'block text-xs font-bold uppercase tracking-widest text-white/50 mb-2';

export const Consultation = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    strategy: '',
    platform: 'MT5',
    budget: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof FormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: sbError } = await supabase.from('consultations').insert([
        {
          ...formData,
          status: 'pending',
        },
      ]);

      if (sbError) throw sbError;
      setSubmitted(true);
    } catch (err: any) {
      console.error('[Consultation] Submit error:', err);
      setError(
        err?.message?.includes('network')
          ? 'Network error. Please check your connection and try again.'
          : 'Submission failed. Please email us directly at consult@ifxtrades.com'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout showFooter={true}>
      <PageMeta
        title="Book a Consultation | IFX Trades"
        description="Free 30-minute institutional consultation. Our engineering team will contact you within 24 hours to scope your proprietary trading system."
        path="/consultation"
        keywords={['algo trading consultation', 'custom trading bot development', 'institutional EA builder']}
      />

      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            variants={institutionalVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-12"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00E5FF] mb-4">
              Free Initial Consultation
            </p>
            <h1 className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter uppercase leading-tight mb-4">
              Initiate Your <span className="text-[#00E5FF]">Project</span>
            </h1>
            <p className="text-white/50 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Expert guidance within 24 hours. No commitment required. Our
              engineering team will scope your system end-to-end.
            </p>
          </motion.div>

          {/* Success State */}
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="p-12 rounded-[2rem] bg-[#00E5FF]/5 border border-[#00E5FF]/20 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-[#00E5FF]" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
                Request Received
              </h3>
              <p className="text-white/50 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                Our engineering team will contact you within 24 hours to begin
                scoping your project.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="mailto:consult@ifxtrades.com"
                  className="flex items-center gap-2 text-[#00E5FF] text-sm hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  consult@ifxtrades.com
                </a>
                <span className="text-white/20 hidden sm:block">·</span>
                <a
                  href="tel:+971501234567"
                  className="flex items-center gap-2 text-[#00E5FF] text-sm hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  +971 50 123 4567
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.form
              variants={institutionalVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.15 }}
              onSubmit={handleSubmit}
              className="p-8 sm:p-10 rounded-[2rem] bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm space-y-6"
            >
              {/* Error Banner */}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
                  <span className="shrink-0 mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={LABEL_CLASS} htmlFor="con-name">Full Name *</label>
                  <input
                    id="con-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => update('name', e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="Jane Doe"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS} htmlFor="con-email">Email *</label>
                  <input
                    id="con-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => update('email', e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="jane@firm.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={LABEL_CLASS} htmlFor="con-phone">Phone</label>
                  <input
                    id="con-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="+1 (555) 000-0000"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS} htmlFor="con-company">Company / Fund</label>
                  <input
                    id="con-company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => update('company', e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="Apex Capital Partners"
                    autoComplete="organization"
                  />
                </div>
              </div>

              {/* Strategy */}
              <div>
                <label className={LABEL_CLASS} htmlFor="con-strategy">
                  Strategy / Project Brief *
                </label>
                <textarea
                  id="con-strategy"
                  required
                  rows={4}
                  value={formData.strategy}
                  onChange={(e) => update('strategy', e.target.value)}
                  className={INPUT_CLASS + ' resize-none'}
                  placeholder="Describe your trading strategy, entry/exit rules, instruments traded, risk parameters..."
                />
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={LABEL_CLASS} htmlFor="con-platform">Platform</label>
                  <select
                    id="con-platform"
                    value={formData.platform}
                    onChange={(e) => update('platform', e.target.value)}
                    className={INPUT_CLASS}
                  >
                    <option value="MT4">MetaTrader 4</option>
                    <option value="MT5">MetaTrader 5</option>
                    <option value="cTrader">cTrader</option>
                    <option value="NinjaTrader">NinjaTrader</option>
                    <option value="Python">Python / Custom</option>
                    <option value="Other">Other / Not Sure</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLASS} htmlFor="con-budget">Budget Range</label>
                  <select
                    id="con-budget"
                    value={formData.budget}
                    onChange={(e) => update('budget', e.target.value)}
                    className={INPUT_CLASS}
                  >
                    <option value="">Select a range</option>
                    <option value="under-2500">Under $2,500</option>
                    <option value="2500-5000">$2,500 – $5,000</option>
                    <option value="5000-10000">$5,000 – $10,000</option>
                    <option value="10000-25000">$10,000 – $25,000</option>
                    <option value="25000+">$25,000+</option>
                  </select>
                </div>
              </div>

              {/* Submit */}
              <SovereignButton
                variant="sovereign"
                fluid
                glowEffect
                isLoading={loading}
                trackingEvent="consultation_form_submit"
                type="submit"
                className="py-4 text-base"
                rightIcon={!loading ? <ArrowRight className="w-5 h-5" /> : undefined}
              >
                {loading ? 'Submitting…' : 'Request Free Consultation'}
              </SovereignButton>

              <p className="text-[10px] text-center text-white/30 leading-relaxed">
                By submitting you agree to our{' '}
                <a href="/privacy" className="hover:text-[#00E5FF] transition-colors underline">
                  Privacy Policy
                </a>
                . We never share your information with third parties.
              </p>
            </motion.form>
          )}

          {/* Contact Footer Trio */}
          {!submitted && (
            <motion.div
              variants={institutionalVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
            >
              {[
                { Icon: Mail, label: 'consult@ifxtrades.com', href: 'mailto:consult@ifxtrades.com' },
                { Icon: Phone, label: '+971 50 123 4567', href: 'tel:+971501234567' },
                { Icon: Calendar, label: 'Response within 24 hours', href: '#' },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex flex-col items-center gap-2 text-white/40 hover:text-[#00E5FF] transition-colors duration-200 group"
                >
                  <Icon className="w-5 h-5 text-[#00E5FF]" />
                  <span className="text-sm">{label}</span>
                </a>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default Consultation;
