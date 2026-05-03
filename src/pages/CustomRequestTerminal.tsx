import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/ui/Navbar';
import { Footer } from '../components/ui/Footer';
import { EliteButton } from '../components/ui/Button';
import { logger } from '../core/logger';
import { toast } from 'react-hot-toast';

/**
 * CustomRequestTerminal
 * 
 * A high-fidelity, terminal-inspired interface for institutional 
 * "Deep Coding" and custom engineering requests.
 */
export const CustomRequestTerminal: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project_type: 'MT5_ALGO',
    description: '',
    budget: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/custom-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('System failure during transmission');
      
      setIsSuccess(true);
      toast.success('Protocol Initiated: Request Transmitted');
    } catch (err: any) {
      logger.error({ err: err.message }, 'CustomRequestTerminal.handleSubmit Failure');
      toast.error('Transmission Failure: Please check network status');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#BAC9CC] font-sans">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-[#00E5FF]/20 bg-[#0a0a0b] p-8 rounded-lg shadow-2xl relative overflow-hidden"
        >
          {/* Terminal Header Decor */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent" />
          
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-[#00E5FF] mb-2 tracking-tight">DEEP CODING TERMINAL</h1>
            <p className="text-sm text-[#849396] uppercase tracking-widest">Institutional Engineering Fulfillment Protocol</p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#00E5FF] mb-1 uppercase">Full Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#121214] border border-[#BAC9CC]/10 p-3 rounded text-white focus:outline-none focus:border-[#00E5FF]/50 transition-colors"
                    placeholder="IDENTIFY SENDER"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#00E5FF] mb-1 uppercase">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[#121214] border border-[#BAC9CC]/10 p-3 rounded text-white focus:outline-none focus:border-[#00E5FF]/50 transition-colors"
                    placeholder="PROTOCOL CONTACT"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00E5FF] mb-1 uppercase">Project Domain</label>
                <select 
                  value={formData.project_type}
                  onChange={(e) => setFormData({...formData, project_type: e.target.value})}
                  className="w-full bg-[#121214] border border-[#BAC9CC]/10 p-3 rounded text-white focus:outline-none focus:border-[#00E5FF]/50 transition-colors appearance-none"
                >
                  <option value="MT5_ALGO">MetaTrader 5 Algorithmic Development</option>
                  <option value="PYTHON_QUANT">Python Quantitative Infrastructure</option>
                  <option value="WEB_DASHBOARD">Custom Institutional Dashboard</option>
                  <option value="AI_INTEGRATION">AI/ML Signal Optimization</option>
                  <option value="OTHER">Other Custom Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00E5FF] mb-1 uppercase">Project Specification</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-[#121214] border border-[#BAC9CC]/10 p-3 rounded text-white focus:outline-none focus:border-[#00E5FF]/50 transition-colors resize-none"
                  placeholder="Describe your architectural requirements..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#00E5FF] mb-1 uppercase">Budget Allocation (USD)</label>
                  <input 
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    className="w-full bg-[#121214] border border-[#BAC9CC]/10 p-3 rounded text-white focus:outline-none focus:border-[#00E5FF]/50 transition-colors"
                    placeholder="ESTIMATED RESOURCE COMMITMENT"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#00E5FF] mb-1 uppercase">Timeline Requirement</label>
                  <input 
                    type="text"
                    value={formData.timeline}
                    onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                    className="w-full bg-[#121214] border border-[#BAC9CC]/10 p-3 rounded text-white focus:outline-none focus:border-[#00E5FF]/50 transition-colors"
                    placeholder="FULFILLMENT WINDOW"
                  />
                </div>
              </div>

              <div className="pt-6">
                <EliteButton 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-lg"
                >
                  {isSubmitting ? 'TRANSMITTING...' : 'INITIATE PROTOCOL'}
                </EliteButton>
              </div>
            </form>
          ) : (
            <div className="text-center py-20">
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="mb-6 inline-block p-4 rounded-full bg-[#00E5FF]/10 text-[#00E5FF]"
              >
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-4">REQUEST SECURED</h2>
              <p className="text-[#849396] max-w-md mx-auto">
                Your architectural requirements have been logged. A lead engineer will analyze your request and establish contact within 24 hours.
              </p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="mt-10 text-[#00E5FF] hover:underline uppercase text-xs tracking-widest"
              >
                Submit another request
              </button>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};
