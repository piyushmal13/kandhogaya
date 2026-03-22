import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { Navbar } from "./components/ui/Navbar";
import { Footer } from "./components/ui/Footer";
import { WhatsAppButton } from "./components/ui/WhatsAppButton";
import { ScrollToTop } from "./components/ScrollToTop";
import { SiteBackdrop } from "./components/site/SiteBackdrop";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

import { useReferral } from "./hooks/useReferral";
import { reinitializeSupabase } from "./lib/supabase";

// ── Lazy-loaded pages (route-level code splitting) ──
const Home = lazy(() => import("./pages/Home").then(m => ({ default: m.Home })));
const Signals = lazy(() => import("./pages/Signals").then(m => ({ default: m.Signals })));
const Marketplace = lazy(() => import("./pages/Marketplace").then(m => ({ default: m.Marketplace })));
const Results = lazy(() => import("./pages/Results").then(m => ({ default: m.Results })));
const Academy = lazy(() => import("./pages/Academy").then(m => ({ default: m.Academy })));
const CourseDetail = lazy(() => import("./pages/CourseDetail").then(m => ({ default: m.CourseDetail })));
const Webinars = lazy(() => import("./pages/Webinars").then(m => ({ default: m.Webinars })));
const WebinarDetail = lazy(() => import("./pages/WebinarDetail").then(m => ({ default: m.WebinarDetail })));
const Blog = lazy(() => import("./pages/Blog").then(m => ({ default: m.Blog })));
const BlogDetail = lazy(() => import("./pages/BlogDetail").then(m => ({ default: m.BlogDetail })));
const Login = lazy(() => import("./pages/Login").then(m => ({ default: m.Login })));
const Dashboard = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })));
const Admin = lazy(() => import("./pages/Admin").then(m => ({ default: m.Admin })));
const AgentDashboard = lazy(() => import("./pages/AgentDashboard").then(m => ({ default: m.AgentDashboard })));
const Hiring = lazy(() => import("./pages/Hiring").then(m => ({ default: m.Hiring })));
const About = lazy(() => import("./pages/About").then(m => ({ default: m.About })));
const Contact = lazy(() => import("./pages/Contact").then(m => ({ default: m.Contact })));
const NotFound = lazy(() => import("./pages/NotFound").then(m => ({ default: m.NotFound })));

const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy").then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService").then(m => ({ default: m.TermsOfService })));
const RiskDisclosure = lazy(() => import("./pages/legal/RiskDisclosure").then(m => ({ default: m.RiskDisclosure })));
const CookiePolicy = lazy(() => import("./pages/legal/CookiePolicy").then(m => ({ default: m.CookiePolicy })));

const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <LoadingSpinner />
  </div>
);

const ReferralHandler = () => {
  useReferral();
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/signals" element={<Signals />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/results" element={<Results />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/academy/:courseId" element={<CourseDetail />} />
            <Route path="/courses" element={<Academy />} />
            <Route path="/webinars" element={<Webinars />} />
            <Route path="/webinars/:id" element={<WebinarDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/agent" element={<AgentDashboard />} />
            <Route path="/hiring" element={<Hiring />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/risk" element={<RiskDisclosure />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  useEffect(() => {
    // Fail-safe: ensure Supabase is initialized even if env vars were missing at build time
    const init = async () => {
      try {
        const res = await fetch("/api/config");
        const config = await res.json();
        if (config.supabaseUrl && config.supabaseAnonKey) {
          reinitializeSupabase(config.supabaseUrl, config.supabaseAnonKey);
        }
      } catch (e) {
        console.error("Failed to fetch runtime config:", e);
      }
    };
    init();
  }, []);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <ReferralHandler />
            <a href="#main-content" className="skip-to-content">
              Skip to main content
            </a>
            <div className="relative min-h-screen overflow-hidden font-sans selection:bg-emerald-200 selection:text-slate-950">
              <SiteBackdrop />
              <Navbar />
              <main id="main-content" className="relative z-10">
                <AnimatedRoutes />
              </main>
              <Footer />
              <WhatsAppButton />
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
