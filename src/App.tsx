import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";

import { Home } from "./pages/Home";
import { Signals } from "./pages/Signals";
import { Marketplace } from "./pages/Marketplace";
import { Results } from "./pages/Results";
import { Academy } from "./pages/Academy";
import { Webinars } from "./pages/Webinars";
import { WebinarDetail } from "./pages/WebinarDetail";
import { Blog } from "./pages/Blog";
import { BlogDetail } from "./pages/BlogDetail";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Admin } from "./pages/Admin";
import { Hiring } from "./pages/Hiring";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";

import { PrivacyPolicy } from "./pages/legal/PrivacyPolicy";
import { TermsOfService } from "./pages/legal/TermsOfService";
import { RiskDisclosure } from "./pages/legal/RiskDisclosure";
import { CookiePolicy } from "./pages/legal/CookiePolicy";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="bg-black min-h-screen font-sans selection:bg-emerald-500 selection:text-black">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signals" element={<Signals />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/results" element={<Results />} />
                <Route path="/courses" element={<Academy />} />
                <Route path="/webinars" element={<Webinars />} />
                <Route path="/webinars/:id" element={<WebinarDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/hiring" element={<Hiring />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Legal Pages */}
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/risk" element={<RiskDisclosure />} />
                <Route path="/cookies" element={<CookiePolicy />} />
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
