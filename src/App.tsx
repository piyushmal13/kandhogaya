import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { DataPulseProvider } from "./hooks/useDataPulse";
import { ToastProvider } from "./contexts/ToastContext";
import { Navbar } from "./components/ui/Navbar";
import { Footer } from "./components/ui/Footer";
import { WhatsAppButton } from "./components/ui/WhatsAppButton";
import { ScrollToTop } from "./components/ScrollToTop";
import { SiteBackdrop } from "./components/site/SiteBackdrop";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { ProtectedRoute } from "./components/ui/ProtectedRoute";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useReferral } from "./hooks/useReferral";

const Home = lazy(() => import("./pages/Home").then(m => ({ default: m.Home })));
const Marketplace = lazy(() => import("./pages/Marketplace").then(m => ({ default: m.Marketplace })));
const Results = lazy(() => import("./pages/Results").then(m => ({ default: m.Results })));
const TradersTravel = lazy(() => import("./pages/TradersTravel").then(m => ({ default: m.TradersTravel })));
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
const AffiliateHub = lazy(() => import("./pages/AffiliateHub").then(m => ({ default: m.AffiliateHub })));

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
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/travel" element={<TradersTravel />} />
            <Route path="/results" element={<Results />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/academy/:courseId" element={<CourseDetail />} />
            <Route path="/courses" element={<Academy />} />
            <Route path="/webinars" element={<Webinars />} />
            <Route path="/webinars/:id" element={<WebinarDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
            <Route path="/agent" element={<ProtectedRoute><AgentDashboard /></ProtectedRoute>} />
            <Route path="/affiliate" element={<ProtectedRoute><AffiliateHub /></ProtectedRoute>} />
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

import { loadSystem } from "./core/systemLoader";

export default function App() {
  useEffect(() => {
    loadSystem();
  }, []);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <DataPulseProvider>
            <Router>
              <ScrollToTop />
              <ReferralHandler />
            <a href="#main-content" className="skip-to-content">
              Skip to main content
            </a>
            <div className="relative min-h-screen overflow-hidden font-sans">
              <div className="noise-overlay" />
              <SiteBackdrop />
              <Navbar />
              <main id="main-content" className="relative z-10">
                <AnimatedRoutes />
              </main>
              <Footer />
              <WhatsAppButton />
              
              {/* Institutional Accountability: Relative Bottom Notice */}
              <div 
                id="regulatory-notice"
                className="relative w-full bg-[#991b1b] text-white text-center p-8 md:p-12 text-[10px] md:text-sm font-black uppercase tracking-[0.2em] z-50 border-t border-white/10"
              >
                <div className="max-w-7xl mx-auto px-4">
                  <span className="opacity-50">CRITICAL INSTITUTIONAL NOTICE:</span> IFX Trades is strictly an education & research platform. We license algorithms, deliver courses, and provide macro analysis. <strong className="text-white underline">WE ARE NOT A BROKER.</strong> We do not accept deposits, execute trades, or handle client funds. Trading involves significant risk.
                </div>
              </div>
              <SpeedInsights />
            </div>

          </Router>
        </DataPulseProvider>
      </AuthProvider>
    </ToastProvider>
  </ErrorBoundary>
);
}
