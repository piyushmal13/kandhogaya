import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/ui/Navbar";
import { Footer } from "./components/ui/Footer";
import { WhatsAppButton } from "./components/ui/WhatsAppButton";
import { ScrollToTop } from "./components/ScrollToTop";

import { Home } from "./pages/Home";
import { Signals } from "./pages/Signals";
import { Marketplace } from "./pages/Marketplace";
import { Results } from "./pages/Results";
import { Academy } from "./pages/Academy";
import { CourseDetail } from "./pages/CourseDetail";
import { Webinars } from "./pages/Webinars";
import { WebinarDetail } from "./pages/WebinarDetail";
import { Blog } from "./pages/Blog";
import { BlogDetail } from "./pages/BlogDetail";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Admin } from "./pages/Admin";
import { AgentDashboard } from "./pages/AgentDashboard";
import { Hiring } from "./pages/Hiring";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";

import { PrivacyPolicy } from "./pages/legal/PrivacyPolicy";
import { TermsOfService } from "./pages/legal/TermsOfService";
import { RiskDisclosure } from "./pages/legal/RiskDisclosure";
import { CookiePolicy } from "./pages/legal/CookiePolicy";

import { useReferral } from "./hooks/useReferral";

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
          
          {/* Legal Pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/risk" element={<RiskDisclosure />} />
          <Route path="/cookies" element={<CookiePolicy />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <ReferralHandler />
          <div className="bg-black min-h-screen font-sans selection:bg-emerald-500 selection:text-white">
            <Navbar />
            <main>
              <AnimatedRoutes />
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
