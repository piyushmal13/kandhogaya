import { motion } from "motion/react";
import { Globe } from "lucide-react";

const testimonials = [
  {
    quote: "The accuracy is frightening. I've passed two prop firm challenges just using the Gold setups.",
    author: "Rahul M.",
    location: "India",
    avatar: "https://i.pravatar.cc/80?u=rahul",
  },
  {
    quote: "Finally a signal service that gives proper risk management advice. Worth every penny.",
    author: "Sarah J.",
    location: "UK",
    avatar: "https://i.pravatar.cc/80?u=sarahj",
  },
  {
    quote: "The speed is incredible. As soon as I get the WhatsApp notification, the price is still valid.",
    author: "Ahmed K.",
    location: "Dubai",
    avatar: "https://i.pravatar.cc/80?u=ahmedk",
  },
];

export const SignalTestimonials = () => (
  <section
    className="py-32 md:py-48 bg-[#020202] border-t border-white/[0.05] relative overflow-hidden"
    aria-labelledby="testimonials-heading"
  >
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-24">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          id="testimonials-heading" 
          className="text-shimmer mb-6 text-center"
        >
          Market <br />
          <span className="italic font-serif text-gradient-emerald">Sentiment.</span>
        </motion.h2>
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 italic">
          Trusted by elite market participants globally.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.author}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8 }}
            className="group relative bg-[#080B12] border border-white/[0.06] p-10 rounded-[2.5rem] hover:border-emerald-500/20 transition-all duration-700 hover:shadow-2xl"
          >
            <Globe className="w-6 h-6 text-emerald-500/20 group-hover:text-emerald-500 transition-colors duration-700 mb-8" aria-hidden="true" />
            <blockquote>
              <p className="text-sm font-black uppercase tracking-widest leading-relaxed mb-10 text-white/60 italic">
                "{t.quote}"
              </p>
            </blockquote>
            <div className="flex items-center gap-6 pt-8 border-t border-white/[0.04]">
              <div className="relative">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-12 h-12 rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700 border border-white/10"
                  width="48"
                  height="48"
                  loading="lazy"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#080B12]" />
              </div>
              <div>
                <div className="text-white font-black text-[10px] uppercase tracking-[0.2em] italic mb-1">{t.author}</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-white/20">
                  {t.location}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
