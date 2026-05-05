import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Save, X, HelpCircle, ChevronUp, ChevronDown } from "lucide-react";
import { faqService, FAQ } from "../../services/faqService";
import { cn } from "@/lib/utils";

export const FAQManager: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);

  const [form, setForm] = useState<Partial<FAQ>>({
    question: "",
    answer: "",
    category: "General",
    priority: 0,
    is_active: true
  });

  const fetchFaqs = async () => {
    setLoading(true);
    const data = await faqService.getAllFaqs();
    setFaqs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setForm({
      question: "",
      answer: "",
      category: "General",
      priority: 0,
      is_active: true
    });
    setFormOpen(false);
  };

  const handleSubmit = async () => {
    if (!form.question || !form.answer) {
      alert("Question and Answer are required.");
      return;
    }

    if (editing) {
      const result = await faqService.updateFaq(editing.id, form);
      if (result) {
        await fetchFaqs();
        resetForm();
      }
    } else {
      const result = await faqService.createFaq(form);
      if (result) {
        await fetchFaqs();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      const success = await faqService.deleteFaq(id);
      if (success) {
        await fetchFaqs();
      }
    }
  };

  const startEdit = (faq: FAQ) => {
    setEditing(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      priority: faq.priority,
      is_active: faq.is_active
    });
    setFormOpen(true);
  };

  const movePriority = async (faq: FAQ, direction: 'up' | 'down') => {
    const newPriority = direction === 'up' ? (faq.priority || 0) - 1 : (faq.priority || 0) + 1;
    await faqService.updateFaq(faq.id, { priority: newPriority });
    await fetchFaqs();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-500" />
          Institutional FAQ Management
        </h2>
        <button
          onClick={() => { resetForm(); setFormOpen(!formOpen); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all text-xs uppercase tracking-widest"
        >
          <Plus className="w-4 h-4" />
          {formOpen ? 'Close' : 'Create New FAQ'}
        </button>
      </div>

      {formOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-white/5 rounded-2xl p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Category</label>
              <input 
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500/50 transition-all" 
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value})} 
                placeholder="e.g. General, Security, Trading"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Priority Index</label>
              <input 
                type="number" 
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500/50 transition-all" 
                value={form.priority} 
                onChange={e => setForm({...form, priority: parseInt(e.target.value)})} 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Institutional Question</label>
            <input 
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500/50 transition-all" 
              value={form.question} 
              onChange={e => setForm({...form, question: e.target.value})} 
              placeholder="Enter the FAQ question..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Response Protocol (Answer)</label>
            <textarea 
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500/50 transition-all min-h-[120px]" 
              value={form.answer} 
              onChange={e => setForm({...form, answer: e.target.value})} 
              placeholder="Enter the detailed answer..."
            />
          </div>

          <div className="flex items-center gap-6 py-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-white/10 bg-black text-emerald-500" 
                checked={form.is_active} 
                onChange={e => setForm({...form, is_active: e.target.checked})} 
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Active in Production</span>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button 
              onClick={handleSubmit} 
              className="px-6 py-2.5 bg-emerald-500 text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editing ? 'Update Intelligence' : 'Deploy FAQ'}
            </button>
            <button 
              onClick={resetForm} 
              className="px-6 py-2.5 bg-white/5 text-white/60 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/5 rounded-2xl">
            <p className="text-white/20 text-xs font-bold uppercase tracking-widest">No FAQ entries found in current registry.</p>
          </div>
        ) : (
          faqs.map((faq) => (
            <div key={faq.id} className="group bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                      {faq.category}
                    </span>
                    <span className="text-[10px] font-mono text-white/20">
                      Priority: {faq.priority}
                    </span>
                    {!faq.is_active && (
                      <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-[8px] font-black text-red-500 uppercase tracking-widest">
                        Hidden
                      </span>
                    )}
                  </div>
                  <h4 className="text-white font-bold text-base mb-2">{faq.question}</h4>
                  <p className="text-sm text-white/40 leading-relaxed max-w-3xl">{faq.answer}</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => movePriority(faq, 'up')}
                      className="p-1.5 bg-white/5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => movePriority(faq, 'down')}
                      className="p-1.5 bg-white/5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => startEdit(faq)} 
                      className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(faq.id)} 
                      className="p-2 bg-red-500/10 rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

import { motion } from "motion/react";
