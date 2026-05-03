import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ShieldCheck, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "group border-b border-white/5 last:border-0 transition-all duration-300",
        isOpen ? "bg-white/[0.02]" : "hover:bg-white/[0.01]"
      )}
    >
      <button
        onClick={onClick}
        className="w-full py-8 px-6 flex items-center justify-between text-left gap-6 outline-none"
      >
        <div className="flex items-start gap-4">
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest mt-1 transition-colors",
            isOpen ? "text-emerald-500" : "text-white/20"
          )}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className={cn(
            "text-lg md:text-xl font-black uppercase italic tracking-tighter transition-all",
            isOpen ? "text-white" : "text-white/60 group-hover:text-white"
          )}>
            {question}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className={cn(
            "p-2 rounded-full border transition-all",
            isOpen ? "bg-emerald-500 border-emerald-500 text-black" : "bg-white/5 border-white/10 text-white/40"
          )}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-16 pb-10 text-white/50 text-sm md:text-base leading-relaxed max-w-3xl font-medium">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const InstitutionalFAQ: React.FC<{ faqs: Array<{ question: string; answer: string }> }> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-24 md:py-36 bg-[#010203] relative overflow-hidden" aria-labelledby="faq-heading">
      {/* Background Ambient */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">
                Institutional Support
              </span>
            </div>
            <h2 id="faq-heading" className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
              Knowledge <br /> <span className="text-white/20">Protocol</span>
            </h2>
          </div>
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.2em] md:text-right max-w-[200px]">
            Comprehensive guide to IFX Trades systematic architecture.
          </p>
        </div>

        <div className="border-t border-white/5">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              index={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        <div className="mt-20 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                 <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-white font-black text-sm uppercase tracking-tight">Need specific intelligence?</div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Our quant desk is available 24/5.</div>
              </div>
           </div>
           <a 
            href="https://wa.me/your-number" 
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
           >
             Initialize Consultation
           </a>
        </div>
      </div>
    </section>
  );
};
