import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Login } from './Login';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: { user: { id: 1 } }, error: null }),
    }
  }
}));

describe('Login Component', () => {
  it('renders login form', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Access the Operating System for Retail Traders')).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText('name@company.com')).toBeInTheDocument();
  });

  it('switches to magic link mode', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Login with Magic Link (OTP)')).toBeInTheDocument();
    });
    
    const magicLinkBtn = screen.getByText('Login with Magic Link (OTP)');
    fireEvent.click(magicLinkBtn);
    
    expect(screen.getByText('Send Magic Link')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('••••••••')).not.toBeInTheDocument();
  });
});
