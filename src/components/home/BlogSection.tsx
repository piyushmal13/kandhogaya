import React, { useState, useEffect } from "react";
import { motion, useMotionValue } from "motion/react";
import { ArrowUpRight, Calendar, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { getBlogPosts } from "../../services/apiHandlers";

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
          className="flex gap-8 cursor-grab"
          drag="x"
          dragConstraints={{ right: 0, left: -1000 }}
          style={{ x }}
        >
          {blogs.map((blog, i) => (
            <Link to={`/blog/${blog.slug}`} key={blog.id} className="block">
              <article 
                className="group cursor-pointer min-w-[300px] md:min-w-[400px]"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 border border-white/10">
                  <img 
                    src={blog.metadata?.cover_image || blog.metadata?.image || `https://picsum.photos/seed/${blog.slug}/800/450`} 
                    alt={blog.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight">
                    {blog.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                    {blog.content}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
