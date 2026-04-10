import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Terminal, 
  Shield, 
  BookOpen, 
  Bell, 
  Search, 
  User, 
  Settings, 
  LayoutDashboard,
  Zap,
  Activity,
  ChevronRight,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { Button } from '../ui/Button';

// ── TYPES ──
interface DashboardLayoutProps {
  children: React.ReactNode;
  leftRail?: React.ReactNode;
  topBar?: React.ReactNode;
  contextPanel?: React.ReactNode;
}

// ── COMPONENTS ──

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  leftRail, 
  topBar, 
  contextPanel 
}) => {
  return (
    <div className="flex h-screen w-full bg-[var(--color6)] overflow-hidden text-white font-sans selection:bg-emerald-500/30">
      {/* ── LEFT RAIL: Navigation (240px) ── */}
      <aside 
        className="relative h-full border-r border-white/5 bg-black/40 backdrop-blur-3xl z-50 flex flex-col w-[240px] hidden lg:flex"
      >
        {leftRail}
      </aside>

      {/* ── MAIN MATRIX ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR (64px) */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md shrink-0 z-40">
          {topBar}
        </header>

        {/* MAIN STAGE */}
        <main className="flex-1 overflow-y-auto bg-black/10 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto p-10 space-y-10">
             {children}
          </div>
        </main>
      </div>

      {/* ── RIGHT CONTEXT PANEL (320px) ── */}
      <aside 
        className="w-[320px] h-full border-l border-white/5 bg-black/40 backdrop-blur-3xl hidden xl:flex flex-col z-50"
      >
        {contextPanel}
      </aside>
    </div>
  );
};
