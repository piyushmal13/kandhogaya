import React from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Calendar, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";

const blogs = [
  {
    id: 1,
    title: "Institutional Order Flow: Decoding the Footprint",
    excerpt: "How smart money leaves clues in the order book and how you can spot them before the move happens.",
    author: "Alex Wright",
    role: "Head Quant",
    date: "Oct 24, 2026",
    readTime: "8 min read",
    category: "Market Mechanics",
    image: "https://picsum.photos/seed/trading1/800/600"
  },
  {
    id: 2,
    title: "The Death of Retail Technical Analysis",
    excerpt: "Why traditional support and resistance is failing and what algorithmic traders are using instead.",
    author: "Sarah Chen",
    role: "Lead Analyst",
    date: "Oct 22, 2026",
    readTime: "6 min read",
    category: "Strategy",
    image: "https://picsum.photos/seed/trading2/800/600"
  },
  {
    id: 3,
    title: "HFT Infrastructure: A Deep Dive",
    excerpt: "Building low-latency execution systems for the modern retail trader. From co-location to FPGA.",
    author: "Marcus Thorne",
    role: "CTO",
    date: "Oct 18, 2026",
    readTime: "12 min read",
    category: "Technology",
    image: "https://picsum.photos/seed/trading3/800/600"
  }
];

export const BlogSection = () => {
  return (
    <section className="py-24 bg-[#020202] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-gray-400 text-xs font-mono tracking-widest mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              MARKET INTELLIGENCE
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white tracking-tighter"
            >
              Institutional Insights
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/blog" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              View All Articles
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog, i) => (
            <motion.article 
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 border border-white/10">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-mono text-white uppercase tracking-wider">
                    {blog.category}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {blog.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {blog.readTime}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight">
                  {blog.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                  {blog.excerpt}
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-medium">{blog.author}</div>
                    <div className="text-gray-600 text-[10px] font-mono uppercase">{blog.role}</div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
};
