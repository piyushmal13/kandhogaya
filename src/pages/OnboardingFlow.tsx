import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, ArrowRight, User, Shield, Zap, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const onboardingSteps = [
  {
    id: 'welcome',
    title: 'Welcome to IFX Trades',
    description: 'Your journey to institutional-grade trading intelligence begins here.',
    icon: User,
    content: (
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
          <User className="w-12 h-12 text-emerald-500" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white mb-4">Welcome to IFX Trades</h3>
          <p className="text-gray-400 leading-relaxed max-w-md mx-auto">
            You've joined Asia's most sophisticated institutional trading platform. 
            Let's get you set up with the tools and insights that drive professional results.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'security',
    title: 'Security First',
    description: 'Your data and trading activities are protected by enterprise-grade security.',
    icon: Shield,
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-black text-white mb-4">Bank-Level Security</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Check className="w-5 h-5 text-emerald-500" />
              <span className="text-white font-bold">End-to-End Encryption</span>
            </div>
            <p className="text-gray-400 text-sm">All data is encrypted using AES-256 military-grade encryption.</p>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Check className="w-5 h-5 text-emerald-500" />
              <span className="text-white font-bold">Zero-Knowledge Architecture</span>
            </div>
            <p className="text-gray-400 text-sm">We cannot access your trading data or personal information.</p>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Check className="w-5 h-5 text-emerald-500" />
              <span className="text-white font-bold">Regulatory Compliance</span>
            </div>
            <p className="text-gray-400 text-sm">Fully compliant with international data protection standards.</p>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Check className="w-5 h-5 text-emerald-500" />
              <span className="text-white font-bold">24/7 Monitoring</span>
            </div>
            <p className="text-gray-400 text-sm">Continuous security monitoring and threat detection.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'capabilities',
    title: 'Your Trading Arsenal',
    description: 'Access institutional-grade tools and intelligence.',
    icon: Zap,
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-12 h-12 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-black text-white mb-4">Professional Trading Tools</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-emerald-500" />
            </div>
            <h4 className="text-white font-bold mb-2">Algorithmic Strategies</h4>
            <p className="text-gray-400 text-sm">Access battle-tested algorithms with proven performance records.</p>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-emerald-500" />
            </div>
            <h4 className="text-white font-bold mb-2">Expert Webinars</h4>
            <p className="text-gray-400 text-sm">Learn from senior traders and quantitative analysts.</p>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-emerald-500" />
            </div>
            <h4 className="text-white font-bold mb-2">Risk Management</h4>
            <p className="text-gray-400 text-sm">Advanced risk controls and position management tools.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'complete',
    title: 'Ready to Trade',
    description: 'Your account is fully configured. Start exploring the platform.',
    icon: Check,
    content: (
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-12 h-12 text-emerald-500" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white mb-4">You're All Set!</h3>
          <p className="text-gray-400 leading-relaxed max-w-md mx-auto mb-8">
            Your IFX Trades account is ready. Explore the marketplace, join upcoming webinars, 
            and start building your trading edge with institutional intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all">
              Explore Marketplace
            </button>
            <button className="px-8 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all">
              View Webinars
            </button>
          </div>
        </div>
      </div>
    )
  }
];

export const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const nextStep = async () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await supabase
        .from('users')
        .update({ 
          onboarding_completed: true,
          full_name: userProfile?.full_name
        } as any).eq('id', user?.id);

      setCompleted(true);
      setTimeout(() => navigate('/marketplace'), 2000);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--color10)] flex flex-col">
      <div className="w-full bg-black/40 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">{currentStep + 1}</span>
              </div>
              <div>
                <h2 className="text-white font-bold">{onboardingSteps[currentStep].title}</h2>
                <p className="text-gray-400 text-sm">{onboardingSteps[currentStep].description}</p>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              {currentStep + 1} of {onboardingSteps.length}
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1">
            <div 
              className="bg-emerald-500 h-1 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-[var(--color6)] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            {onboardingSteps[currentStep].content}
          </motion.div>
        </div>
      </div>

      <div className="border-t border-white/5 bg-black/40">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>
          
          <button
            onClick={nextStep}
            className="px-8 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all flex items-center gap-2"
          >
            {currentStep === onboardingSteps.length - 1 ? 'Complete Setup' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {completed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[var(--color6)] border border-emerald-500/20 rounded-3xl p-8 text-center max-w-md mx-4"
          >
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4">Welcome Aboard!</h3>
            <p className="text-gray-400 mb-6">Redirecting you to the marketplace...</p>
            <div className="w-full bg-white/10 rounded-full h-1">
              <motion.div 
                className="bg-emerald-500 h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};