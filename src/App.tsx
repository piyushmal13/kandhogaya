import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { DataPulseProvider } from "./hooks/useDataPulse";
import { ToastProvider } from "./contexts/ToastContext";
import { StandardLayout } from "./components/site/StandardLayout";
import { ProtectedRoute } from "./components/ui/ProtectedRoute";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/reactQuery";
import { loadSystem } from "./core/systemLoader";
import { HelmetProvider } from "react-helmet-async";
import { FeatureGuard } from "./components/ui/FeatureGuard";
import { GlobalPromotionBanner } from "./components/institutional/GlobalPromotionBanner";

const Home = lazy(() => import("./pages/Home"));
const Marketplace = lazy(() => import("./pages/Marketplace").then(m => ({ default: m.Marketplace })));

const Webinars = lazy(() => import("./pages/Webinars").then(m => ({ default: m.Webinars })));
const WebinarDetail = lazy(() => import("./pages/WebinarDetail").then(m => ({ default: m.WebinarDetail })));
const Blog = lazy(() => import("./pages/Blog").then(m => ({ default: m.Blog })));
const BlogDetail = lazy(() => import("./pages/BlogDetail").then(m => ({ default: m.BlogDetail })));
const Login = lazy(() => import("./pages/Login").then(m => ({ default: m.Login })));
const Dashboard = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })));
const Admin = lazy(() => import("./pages/Admin").then(m => ({ default: m.Admin })));
const AgentDashboard = lazy(() => import("./pages/AgentDashboard").then(m => ({ default: m.AgentDashboard })));
const Contact = lazy(() => import("./pages/Contact").then(m => ({ default: m.Contact })));
const About = lazy(() => import("./pages/About").then(m => ({ default: m.About })));
const Results = lazy(() => import("./pages/Results").then(m => ({ default: m.Results })));
const Academy = lazy(() => import("./pages/Academy").then(m => ({ default: m.Academy })));
const Pricing = lazy(() => import("./pages/Pricing").then(m => ({ default: m.Pricing })));
const Hiring = lazy(() => import("./pages/Hiring").then(m => ({ default: m.Hiring })));
const NotFound = lazy(() => import("./pages/NotFound").then(m => ({ default: m.NotFound })));
const InstitutionalError = lazy(() => import("./pages/Error").then(m => ({ default: m.InstitutionalError })));
const Solutions = lazy(() => import("./pages/Solutions").then(m => ({ default: m.Solutions })));
const Consultation = lazy(() => import("./pages/Consultation").then(m => ({ default: m.Consultation })));
const InstitutionalSkeleton = lazy(() => import("./components/institutional/InstitutionalSkeleton").then(m => ({ default: m.InstitutionalSkeleton })));
const DashboardLayout = lazy(() => import("./components/institutional/DashboardLayout").then(m => ({ default: m.DashboardLayout })));

const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy").then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService").then(m => ({ default: m.TermsOfService })));
const RiskDisclosure = lazy(() => import("./pages/legal/RiskDisclosure").then(m => ({ default: m.RiskDisclosure })));
const CookiePolicy = lazy(() => import("./pages/legal/CookiePolicy").then(m => ({ default: m.CookiePolicy })));
const AffiliateHub = lazy(() => import("./pages/AffiliateHub").then(m => ({ default: m.AffiliateHub })));
const QuantX = lazy(() => import("./pages/QuantX").then(m => ({ default: m.QuantX })));

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Suspense fallback={<InstitutionalSkeleton />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/marketplace" element={<FeatureGuard flag="marketplace" redirect="/dashboard"><Marketplace /></FeatureGuard>} />
            <Route path="/quantx" element={<ProtectedRoute><QuantX /></ProtectedRoute>} />
            <Route path="/webinars" element={<FeatureGuard flag="webinars" redirect="/dashboard"><Webinars /></FeatureGuard>} />
            <Route path="/webinars/:id" element={<WebinarDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
            <Route path="/agent" element={<ProtectedRoute><AgentDashboard /></ProtectedRoute>} />
            <Route path="/affiliate" element={<ProtectedRoute><AffiliateHub /></ProtectedRoute>} />
            <Route path="/results" element={<Results />} />
            <Route path="/academy" element={<FeatureGuard flag="academy" redirect="/dashboard"><Academy /></FeatureGuard>} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/hiring" element={<Hiring />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/risk" element={<RiskDisclosure />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="*" element={<InstitutionalError />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

function AppContent() {
  const location = useLocation();
  const isPlainLayout = ['/login'].some(path => location.pathname.startsWith(path));
  const isTerminalLayout = ['/dashboard', '/admin', '/agent', '/affiliate', '/quantx'].some(path => location.pathname.startsWith(path));

  if (isPlainLayout || isTerminalLayout) {
    return <AnimatedRoutes />;
  }

  return (
    <StandardLayout>
      {/* <GlobalPromotionBanner /> - Deactivated per CEO's 'zero pop-up' directive */}
      <AnimatedRoutes />
    </StandardLayout>
  );
}

export default function App() {
  useEffect(() => {
    loadSystem();
  }, []);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <AuthProvider>
              <DataPulseProvider>
                <Router>
                  <AppContent />
                </Router>
              </DataPulseProvider>
            </AuthProvider>
          </ToastProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
