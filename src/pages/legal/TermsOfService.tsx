import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const TermsOfService = () => {
  return (
    <div className="bg-[#020202] min-h-screen text-gray-300 py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-400 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        <div className="prose prose-invert prose-emerald max-w-none">
          <p className="text-sm text-gray-500 mb-8">Last Updated: October 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using IFXTrades ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily access the materials (information or software) on IFXTrades' website for personal, non-commercial transitory viewing only.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>This is the grant of a license, not a transfer of title.</li>
              <li>You may not modify or copy the materials.</li>
              <li>You may not use the materials for any commercial purpose.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. Disclaimer</h2>
            <p>
              The materials on IFXTrades' website are provided on an 'as is' basis. IFXTrades makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Limitations</h2>
            <p>
              In no event shall IFXTrades or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on IFXTrades' website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
