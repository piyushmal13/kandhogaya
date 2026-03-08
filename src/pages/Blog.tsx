import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const Blog = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("/api/content?type=blog")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("Failed to load posts:", data);
          setPosts([]);
        }
      })
      .catch(err => {
        console.error("Error fetching posts:", err);
        setPosts([]);
      });
  }, []);

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Market Insights</h1>
        <p className="text-gray-400">Expert analysis on Forex, Gold, and Global Macro markets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: any) => (
          <Link key={post.id} to={`/blog/${post.slug}`} className="group">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all">
              <div className="aspect-video bg-black overflow-hidden">
                <img src={`https://picsum.photos/seed/${post.slug}/800/450`} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="p-6">
                <div className="text-[10px] text-emerald-500 font-bold uppercase mb-2 tracking-widest">Market Analysis</div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-500 transition-colors">{post.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-3 mb-6">{post.body}</p>
                <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase">
                  <span>{new Date(post.published_at).toLocaleDateString()}</span>
                  <span>5 min read</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
