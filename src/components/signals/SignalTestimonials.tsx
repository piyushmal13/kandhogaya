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
    quote: "The latency is non-existent. As soon as I get the WhatsApp notification, the price is still valid.",
    author: "Ahmed K.",
    location: "Dubai",
    avatar: "https://i.pravatar.cc/80?u=ahmedk",
  },
];

export const SignalTestimonials = () => (
  <section
    className="py-24 border-t border-[var(--border-default)]"
    style={{ background: "var(--bg-base)" }}
    aria-labelledby="testimonials-heading"
  >
    <div className="max-w-7xl mx-auto px-4">
      <h2 id="testimonials-heading" className="text-3xl md:text-5xl font-bold text-center text-white mb-16">
        Trusted by Traders Worldwide
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.author}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="site-panel-muted p-8 relative"
            role="article"
          >
            <Globe className="w-5 h-5 text-emerald-400 mb-4" aria-hidden="true" />
            <blockquote>
              <p className="leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                "{t.quote}"
              </p>
            </blockquote>
            <div className="flex items-center gap-4">
              <img
                src={t.avatar}
                alt={t.author}
                className="w-10 h-10 rounded-full grayscale"
                width="40"
                height="40"
                loading="lazy"
              />
              <div>
                <div className="text-white font-bold text-sm">{t.author}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
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
