import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/solutions', label: 'Solutions' },
  { path: '/process', label: 'Process' },
  { path: '/case-studies', label: 'Case Studies' },
  { path: '/dashboard', label: 'Client Portal' },
];

export function InstitutionalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#020202]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_1px_0_rgba(255,255,255,0.05)]'
            : 'bg-transparent'
        }`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#3b82f6] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-black font-bold text-lg leading-none">IFX</span>
              </div>
              <span className="text-white font-semibold text-lg hidden sm:block tracking-tight">
                IFX Trades
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium tracking-wide transition-colors relative pb-1 ${
                    location.pathname === item.path
                      ? 'text-[#00E5FF]'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#00E5FF]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <Link
              to="/consultation"
              className="hidden lg:inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-[#c3f5ff] to-[#00e5ff] text-[#00363d] font-black text-sm tracking-widest uppercase rounded-lg hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all duration-300"
            >
              Start Project
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-white/60 hover:text-white transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40 lg:hidden"
              aria-hidden="true"
            />

            {/* Slide Panel */}
            <motion.div
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#10131a] border-l border-white/10 z-50 lg:hidden flex flex-col overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="p-6 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#00E5FF] to-[#3b82f6] flex items-center justify-center">
                      <span className="text-black font-bold text-sm">IFX</span>
                    </div>
                    <span className="text-white font-semibold">IFX Trades</span>
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-white/60 hover:text-[#00E5FF] transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="space-y-1 flex-1">
                  {navItems.map((item, i) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between py-4 px-4 rounded-xl border-b border-white/5 transition-all ${
                          location.pathname === item.path
                            ? 'text-[#00E5FF] bg-[#00E5FF]/5'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="text-base font-semibold">{item.label}</span>
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="mt-8 pt-6 border-t border-white/10"
                >
                  <div className="p-4 rounded-xl bg-[#00E5FF]/5 border border-[#00E5FF]/20 mb-4">
                    <p className="text-[#00E5FF] text-xs font-bold uppercase tracking-widest mb-3">
                      Ready to build your edge?
                    </p>
                    <Link
                      to="/consultation"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full py-3.5 bg-gradient-to-r from-[#c3f5ff] to-[#00e5ff] text-[#00363d] font-black text-sm tracking-widest uppercase rounded-lg hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all"
                    >
                      Book Consultation
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
