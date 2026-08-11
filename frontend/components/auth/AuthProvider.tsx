"use client";

import { createContext, useContext, type ReactNode } from 'react';
import { useCurrentUserQuery } from '@/lib/auth/auth-hooks';
import type { AuthUser } from '@/lib/auth/types';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useCurrentUserQuery();

  return (
    <AuthContext.Provider
      value={{ user: user ?? null, isLoading, isAuthenticated: Boolean(user) }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
