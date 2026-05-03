import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFlags, type FlagKey } from '@/hooks/useFlags';
import { InstitutionalSkeleton } from '../institutional/InstitutionalSkeleton';

interface FeatureGuardProps {
  flag: FlagKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirect?: string;
}

/**
 * FeatureGuard
 * 
 * Enforces dynamic visibility of modules based on Supabase feature flags.
 * If the flag is disabled, it can either redirect the user, show a fallback, or nothing.
 */
export const FeatureGuard: React.FC<FeatureGuardProps> = ({ 
  flag, 
  children, 
  fallback = null, 
  redirect 
}) => {
  const { flags, loading } = useFlags();

  if (loading) {
    return <InstitutionalSkeleton />;
  }

  const isEnabled = flags[flag as keyof typeof flags] !== false;

  if (!isEnabled) {
    if (redirect) {
      return <Navigate to={redirect} replace />;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
