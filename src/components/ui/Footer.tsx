import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Instagram, Twitter, Youtube, Mail, Shield, AlertTriangle, FileText, Globe } from "lucide-react";

export const Footer = () => (
  <footer className="bg-[#050505] border-t border-white/5 pt-24 pb-12 relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />
    
    <div className="max-w-7xl mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
        
        {/* Brand Column */}
        <div className="lg:col-span-4">
          <Link to="/" className="flex items-center mb-8 group">
            <div className="h-12 w-auto flex items-center justify-center overflow-hidden transition-all relative">
              <img 
                src="/logo.png" 
                alt="IFXTrades Logo" 
                className="h-full w-auto object-contain z-10" 
              />
            </div>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
            The Operating System for Retail Traders. Empowering the next generation with institutional-grade intelligence, automated execution, and liquidity solutions.
          </p>
          <div className="flex gap-4">
            {[
              { icon: Twitter, href: "#" },
              { icon: Instagram, href: "#" },
              { icon: Youtube, href: "#" },
              { icon: Mail, href: "#" }
            ].map((social, i) => (
              <a 
                key={i} 
                href={social.href} 
                className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all duration-300 group"
              >
                <social.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>
        </div>

        {/* Links Columns */}
        <div className="lg:col-span-2">
          <h4 className="text-white font-bold mb-6 text-sm tracking-wider uppercase">Platform</h4>
          <ul className="space-y-4 text-sm text-gray-500 font-medium">
            <li><Link to="/signals" className="hover:text-emerald-500 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"/> Live Signals</Link></li>
            <li><Link to="/marketplace" className="hover:text-emerald-500 transition-colors">Algo Marketplace</Link></li>
            <li><Link to="/terminal" className="hover:text-emerald-500 transition-colors">Web Terminal</Link></li>
            <li><Link to="/pricing" className="hover:text-emerald-500 transition-colors">Pricing</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="text-white font-bold mb-6 text-sm tracking-wider uppercase">Resources</h4>
          <ul className="space-y-4 text-sm text-gray-500 font-medium">
            <li><Link to="/academy" className="hover:text-emerald-500 transition-colors">Trading Academy</Link></li>
            <li><Link to="/blog" className="hover:text-emerald-500 transition-colors">Market Insights</Link></li>
            <li><Link to="/webinars" className="hover:text-emerald-500 transition-colors">Webinars</Link></li>
            <li><Link to="/docs" className="hover:text-emerald-500 transition-colors">Documentation</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="text-white font-bold mb-6 text-sm tracking-wider uppercase">Company</h4>
          <ul className="space-y-4 text-sm text-gray-500 font-medium">
            <li><Link to="/about" className="hover:text-emerald-500 transition-colors">About Us</Link></li>
            <li><Link to="/careers" className="hover:text-emerald-500 transition-colors">Careers <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded ml-1">HIRING</span></Link></li>
            <li><Link to="/partners" className="hover:text-emerald-500 transition-colors">Partners</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-500 transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Status Column */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-xs font-bold text-emerald-500 tracking-wider">SYSTEM ONLINE</span>
            </div>
            <div className="space-y-2 text-[10px] font-mono text-gray-500">
              <div className="flex justify-between">
                <span>EXECUTION</span>
                <span className="text-gray-300">12ms</span>
              </div>
              <div className="flex justify-between">
                <span>UPTIME</span>
                <span className="text-gray-300">99.99%</span>
              </div>
              <div className="flex justify-between">
                <span>DATA FEED</span>
                <span className="text-emerald-500">CONNECTED</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6 text-xs text-gray-600 font-medium">
          <span>© 2026 IFXTrades Inc.</span>
          <div className="hidden md:block w-1 h-1 rounded-full bg-gray-800" />
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3" />
            <span>Global Region (English)</span>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500 font-medium">
          <Link to="/privacy" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Shield className="w-3 h-3" /> Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-white transition-colors flex items-center gap-1.5">
            <FileText className="w-3 h-3" /> Terms of Service
          </Link>
          <Link to="/risk" className="hover:text-white transition-colors flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" /> Risk Disclosure
          </Link>
          <Link to="/cookies" className="hover:text-white transition-colors">Cookie Settings</Link>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-12 text-[10px] text-gray-700 leading-relaxed max-w-5xl mx-auto text-center border-t border-white/5 pt-8">
        <p>
          Risk Warning: Trading leveraged products such as Forex and CFDs carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite. You could sustain a loss of some or all of your initial investment. You should be aware of all the risks associated with trading and seek advice from an independent financial advisor if you have any doubts.
        </p>
      </div>

    </div>
  </footer>
);
