import React from 'react';
import { render } from '@testing-library/react';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import { describe, it, expect, vi } from 'vitest';
import { Login } from './Login';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import { BrowserRouter } from 'react-router-dom';

// Mock Supabase
vi.mock('../lib/supabase', () => {
  const mockQueryBuilder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
    limit: vi.fn().mockResolvedValue({ data: [], error: null })
  };

  return {
    supabase: {
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
        signInWithPassword: vi.fn().mockResolvedValue({ data: { user: { id: 1 } }, error: null }),
      },
      from: vi.fn(() => mockQueryBuilder),
    }
  };
});

describe('Login Component', () => {
  it('renders login form', async () => {
    render(
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Access the operating surface for disciplined retail traders.')).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText('name@company.com')).toBeInTheDocument();
  });

  it('switches to magic link mode', async () => {
    render(
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Login with Magic Link (OTP)')).toBeInTheDocument();
    });
    
    const magicLinkBtn = screen.getByText('Login with Magic Link (OTP)');
    fireEvent.click(magicLinkBtn);
    
    expect(screen.getByText('Send Magic Link / OTP')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('••••••••')).not.toBeInTheDocument();
  });
});
