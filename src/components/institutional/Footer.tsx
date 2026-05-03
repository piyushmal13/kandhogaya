import { Link } from 'react-router-dom';

export function Footer() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'IFX Trades',
    url: 'https://ifxtrades.com',
    logo: 'https://ifxtrades.com/logo.png',
    sameAs: [
      'https://twitter.com/ifxtrades',
      'https://linkedin.com/company/ifxtrades',
      'https://youtube.com/ifxtrades'
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      addressCountry: 'AE'
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <footer className="border-t border-white/5 bg-black/20 backdrop-blur-sm mt-auto relative z-10 overflow-hidden">
        {/* Glow Decor */}
        <div className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Intelligence */}
            <div className="space-y-6">
              <div className="flex flex-col">
                <span className="font-black italic uppercase tracking-tighter text-2xl text-white">IFX Trades</span>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500/50">Institutional Platform</span>
              </div>
              <p className="text-[11px] font-medium text-white/40 leading-relaxed uppercase tracking-widest max-w-[200px]">
                Elite algorithmic trading education and quantitative execution architecture.
              </p>
            </div>
            
            {/* Nav Nodes */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Master Clusters</h4>
              <ul className="space-y-3 text-[11px] font-medium text-white/30 uppercase tracking-widest">
                <li><Link to="/marketplace" className="hover:text-emerald-500 transition-colors">Marketplace</Link></li>
                <li><Link to="/academy" className="hover:text-emerald-500 transition-colors">Academy</Link></li>
                <li><Link to="/webinars" className="hover:text-emerald-500 transition-colors">Webinars</Link></li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Compliance</h4>
              <ul className="space-y-3 text-[11px] font-medium text-white/30 uppercase tracking-widest">
                <li><Link to="/privacy" className="hover:text-emerald-500 transition-colors">Private Keys</Link></li>
                <li><Link to="/terms" className="hover:text-emerald-500 transition-colors">Protocols</Link></li>
                <li><Link to="/risk" className="hover:text-emerald-500 transition-colors">Risk Disclosure</Link></li>
              </ul>
            </div>
            
            {/* Telemetry Status */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Node Operations</h4>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-tighter">Systems Nominal</span>
                </div>
                <div className="h-[1px] bg-white/5 w-full" />
                <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest leading-none">
                  Uptime: 99.98% (Elite Alpha Cluster)
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10">
              © {new Date().getFullYear()} IFX TRADES. ELITE EXECUTION NODE.
            </p>
            <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
              Educational services only. Not a brokerage entity.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
