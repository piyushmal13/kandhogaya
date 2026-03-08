import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Instagram, Twitter, Youtube, Mail } from "lucide-react";

export const Footer = () => (
  <footer className="bg-black border-t border-white/5 pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center mb-6 group">
            <div className="h-10 w-auto flex items-center justify-center overflow-hidden transition-all relative">
              <img 
                src="/logo.png" 
                alt="IFXTrades Logo" 
                className="h-full w-auto object-contain z-10" 
              />
            </div>
          </Link>
          <p className="text-gray-500 max-w-sm mb-8">
            The Operating System for Retail Traders. Empowering the next generation of traders with institutional-grade intelligence and automated solutions.
          </p>
          <div className="flex gap-4">
            {[Instagram, Twitter, Youtube, Mail].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-black transition-all">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Ecosystem</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><Link to="/signals" className="hover:text-emerald-500 transition-colors">Trading Signals</Link></li>
            <li><Link to="/marketplace" className="hover:text-emerald-500 transition-colors">Algo Marketplace</Link></li>
            <li><Link to="/courses" className="hover:text-emerald-500 transition-colors">Trading Academy</Link></li>
            <li><Link to="/webinars" className="hover:text-emerald-500 transition-colors">Live Webinars</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><Link to="/about" className="hover:text-emerald-500 transition-colors">About Us</Link></li>
            <li><Link to="/blog" className="hover:text-emerald-500 transition-colors">Market Insights</Link></li>
            <li><Link to="/hiring" className="hover:text-emerald-500 transition-colors">Join the Team</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-500 transition-colors">Contact Support</Link></li>
          </ul>
        </div>
      </div>
      <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-xs text-gray-600">© 2026 IFXTrades Trading Intelligence Hub. All rights reserved.</div>
        <div className="flex gap-8 text-xs text-gray-600">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);
