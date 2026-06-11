import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { DataPulseProvider } from "./hooks/useDataPulse";
import { ToastProvider } from "./contexts/ToastContext";
import { StandardLayout } from "./components/site/StandardLayout";
import { ProtectedRoute } from "./components/ui/ProtectedRoute";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/reactQuery";
import { loadSystem } from "./core/systemLoader";
import { HelmetProvider } from "react-helmet-async";
import { FeatureGuard } from "./components/ui/FeatureGuard";
import { useReferral } from "./hooks/useReferral";
import { CartProvider } from "./contexts/CartContext";
import { CartSlideover } from "./components/payments/CartSlideover";

// ⚡ STATIC IMPORTS FOR EAGER PUBLIC PAGES (0ms chunk latency)
import Home from "./pages/Home";
import { Marketplace } from "./pages/Marketplace";
import { Webinars } from "./pages/Webinars";
import { Blog } from "./pages/Blog";
import { Contact } from "./pages/Contact";
import { About } from "./pages/About";
import { Results } from "./pages/Results";
import { Pricing } from "./pages/Pricing";
import { Solutions } from "./pages/Solutions";
import { QuantX } from "./pages/QuantX";
import { NewsletterPopup } from "./components/ui/NewsletterPopup";

// 🦥 LAZY IMPORTS FOR PRIVATE & ADMIN SECTIONS (Maintains clean bundle sizes)
const WebinarDetail = lazy(() => import("./pages/WebinarDetail").then(m => ({ default: m.WebinarDetail })));
const BlogDetail = lazy(() => import("./pages/BlogDetail").then(m => ({ default: m.BlogDetail })));
const Login = lazy(() => import("./pages/Login").then(m => ({ default: m.Login })));
const Dashboard = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })));
const Admin = lazy(() => import("./pages/Admin").then(m => ({ default: m.Admin })));
const AgentDashboard = lazy(() => import("./pages/AgentDashboard").then(m => ({ default: m.AgentDashboard })));
const SeoAgent = lazy(() => import("./pages/SeoAgent").then(m => ({ default: m.SeoAgent })));
const Hiring = lazy(() => import("./pages/Hiring").then(m => ({ default: m.Hiring })));
const BrokerTalent = lazy(() => import("./pages/BrokerTalent").then(m => ({ default: m.BrokerTalent })));
const NotFound = lazy(() => import("./pages/NotFound").then(m => ({ default: m.NotFound })));
const InstitutionalError = lazy(() => import("./pages/Error").then(m => ({ default: m.InstitutionalError })));
const Consultation = lazy(() => import("./pages/Consultation").then(m => ({ default: m.Consultation })));
const CustomRequestTerminal = lazy(() => import("./pages/CustomRequestTerminal").then(m => ({ default: m.CustomRequestTerminal })));
const InstitutionalSkeleton = lazy(() => import("./components/institutional/InstitutionalSkeleton").then(m => ({ default: m.InstitutionalSkeleton })));
const DashboardLayout = lazy(() => import("./components/institutional/DashboardLayout").then(m => ({ default: m.DashboardLayout })));

const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy").then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService").then(m => ({ default: m.TermsOfService })));
const RiskDisclosure = lazy(() => import("./pages/legal/RiskDisclosure").then(m => ({ default: m.RiskDisclosure })));
const CookiePolicy = lazy(() => import("./pages/legal/CookiePolicy").then(m => ({ default: m.CookiePolicy })));
const AffiliateHub = lazy(() => import("./pages/AffiliateHub").then(m => ({ default: m.AffiliateHub })));
const B2BLiquidity = lazy(() => import("./pages/B2BLiquidity").then(m => ({ default: m.B2BLiquidity })));
const B2BWhiteLabel = lazy(() => import("./pages/B2BWhiteLabel").then(m => ({ default: m.B2BWhiteLabel })));
const MT4MT5Bridge = lazy(() => import("./pages/MT4MT5Bridge").then(m => ({ default: m.MT4MT5Bridge })));
const Settings = lazy(() => import("./pages/Settings").then(m => ({ default: m.Settings })));

import { LegacyRedirect } from "./components/ui/LegacyRedirect";

const SearchRedirect = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || searchParams.get("search") || "";
  return <Navigate to={`/marketplace?q=${encodeURIComponent(q)}`} replace />;
};

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
            <Route path="/solutions/bridge" element={<MT4MT5Bridge />} />
            <Route path="/solutions/custom" element={<CustomRequestTerminal />} />
            <Route path="/solutions/seo-agent" element={<SeoAgent />} />
            <Route path="/search" element={<SearchRedirect />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/marketplace" element={<FeatureGuard flag="marketplace" redirect="/dashboard"><Marketplace /></FeatureGuard>} />
            <Route path="/quantx" element={<QuantX />} />
            <Route path="/webinars" element={<FeatureGuard flag="webinars" redirect="/dashboard"><Webinars /></FeatureGuard>} />
            <Route path="/webinars/:id" element={<WebinarDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
            <Route path="/agent" element={<ProtectedRoute><AgentDashboard /></ProtectedRoute>} />
            <Route path="/affiliate" element={<AffiliateHub />} />
            <Route path="/results" element={<Results />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/hiring" element={<Hiring />} />
            <Route path="/careers" element={<Hiring />} />
            <Route path="/broker-talent" element={<BrokerTalent />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/b2b/liquidity" element={<B2BLiquidity />} />
            <Route path="/b2b/white-label" element={<B2BWhiteLabel />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/risk" element={<RiskDisclosure />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<InstitutionalError />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

function AppContent() {
  useReferral();
  const location = useLocation();
  const { user } = useAuth();
  const isPlainLayout = ['/login', '/dashboard', '/admin', '/agent', '/settings'].some(path => location.pathname.startsWith(path)) || (location.pathname.startsWith('/affiliate') && !!user);

  if (isPlainLayout) {
    return (
      <>
        <LegacyRedirect />
        <AnimatedRoutes />
        <CartSlideover />
      </>
    );
  }

  return (
    <StandardLayout>
      <LegacyRedirect />
      {/* <GlobalPromotionBanner /> - Deactivated per CEO's 'zero pop-up' directive */}
      <AnimatedRoutes />
      <NewsletterPopup />
      <CartSlideover />
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
              <LanguageProvider>
                <CartProvider>
                  <DataPulseProvider>
                    <Router>
                      <AppContent />
                    </Router>
                  </DataPulseProvider>
                </CartProvider>
              </LanguageProvider>
            </AuthProvider>
          </ToastProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
