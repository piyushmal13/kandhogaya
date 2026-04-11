import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Youtube } from 'lucide-react';

export function InstitutionalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0d14] border-t border-white/[0.06] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#3b82f6] flex items-center justify-center">
                <span className="text-black font-bold text-lg leading-none">IFX</span>
              </div>
              <span className="text-white font-semibold text-xl tracking-tight">IFX Trades</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-sm">
              Engineering proprietary trading systems for institutional desks since 2018.
              From concept to deployment — we build your edge.
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Linkedin, href: 'https://linkedin.com/company/ifxtrades', label: 'LinkedIn' },
                { Icon: Twitter,  href: 'https://twitter.com/ifxtrades',          label: 'Twitter'  },
                { Icon: Youtube,  href: 'https://youtube.com/ifxtrades',          label: 'YouTube'  },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-[#00E5FF] hover:bg-[#00E5FF]/10 hover:border-[#00E5FF]/20 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {[
            {
              title: 'Solutions',
              links: [
                { label: 'Algorithmic Development', href: '/solutions#essential' },
                { label: 'Backtesting Suite',       href: '/solutions#professional' },
                { label: 'Infrastructure Setup',    href: '/solutions#institutional' },
                { label: 'Maintenance Plans',       href: '/solutions#maintenance' },
              ],
            },
            {
              title: 'Company',
              links: [
                { label: 'About Us',     href: '/about' },
                { label: 'Case Studies', href: '/case-studies' },
                { label: 'Process',      href: '/process' },
                { label: 'Careers',      href: '/hiring' },
              ],
            },
            {
              title: 'Resources',
              links: [
                { label: 'Academy',      href: '/academy' },
                { label: 'Webinars',     href: '/webinars' },
                { label: 'Blog',         href: '/blog' },
                { label: 'Consultation', href: '/consultation' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-6 uppercase tracking-widest">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-white/50 text-sm hover:text-[#00E5FF] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-10 border-y border-white/[0.06]">
          {[
            { Icon: Mail,  value: 'consult@ifxtrades.com', href: 'mailto:consult@ifxtrades.com' },
            { Icon: Phone, value: '+971 50 123 4567',       href: 'tel:+971501234567' },
            { Icon: MapPin, value: 'Dubai, UAE',             href: '#' },
          ].map(({ Icon, value, href }) => (
            <a
              key={value}
              href={href}
              className="flex items-center gap-3 text-white/50 hover:text-[#00E5FF] transition-colors duration-200 group"
            >
              <Icon className="w-4 h-4 text-[#00E5FF] shrink-0" />
              <span className="text-sm">{value}</span>
            </a>
          ))}
        </div>

        {/* Legal Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-white/30 text-xs text-center md:text-left">
            © {currentYear} IFX Trades. All rights reserved. Not a broker.
            Educational and engineering services only.
          </p>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Cookie Policy', href: '/cookies' },
              { label: 'Risk Disclosure', href: '/risk' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                to={href}
                className="text-white/30 text-xs hover:text-white/60 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
