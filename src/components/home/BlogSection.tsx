import React, { useState, useEffect } from "react";
import { motion, useMotionValue } from "motion/react";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { getBlogPosts } from "../../services/apiHandlers";
import { resolveBlogImage, stripHtml } from "../../utils/blogUtils";

export const BlogSection = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const x = useMotionValue(0);

  useEffect(() => {
    getBlogPosts(0, 5).then((data) => {
      if (Array.isArray(data)) {
        setBlogs(data);
      }
    });
  }, []);

  return (
    <section className="py-24 bg-[#020202] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
              Institutional Insights
            </h2>
          </div>
          
          <Link to="/blog" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            View All Articles
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <motion.div 
          className="flex gap-10 cursor-grab pb-10"
          drag="x"
          dragConstraints={{ right: 0, left: -1000 }}
          style={{ x }}
        >
          {blogs.map((blog, i) => (
            <Link to={`/blog/${blog.slug}`} key={blog.id} className="block shrink-0">
              <article 
                className="group cursor-pointer w-[320px] md:w-[450px]"
              >
                <div className="relative aspect-[16/10] rounded-[32px] overflow-hidden mb-8 border border-white/5 bg-[#0a0a0a]">
                  <img 
                    src={resolveBlogImage(blog, "thumb")} 
                    alt={blog.title}
                    className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-[2s] opacity-70 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  
                  {/* Category Tag */}
                  <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-[0.2em]">
                    {blog.category || "Research"}
                  </div>
                </div>

                <div className="space-y-4 px-2">
                  <div className="flex items-center gap-4 text-[9px] font-black text-gray-600 uppercase tracking-widest">
                    <Calendar className="w-3 h-3 text-emerald-500/50" />
                    {new Date(blog.created_at).toLocaleDateString()}
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> 5 MIN</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-emerald-400 transition-colors leading-[0.95] tracking-tighter">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 font-medium opacity-80">
                    {blog.metadata?.bold_headline || stripHtml(blog.content)}
                  </p>
                  
                  <div className="pt-4 flex items-center gap-3 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
                    Read Analysis
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
