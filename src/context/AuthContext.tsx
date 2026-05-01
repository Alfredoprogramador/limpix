import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { User } from '../types';
import { createUser, getUserByEmail } from '../services/database';

const AUTH_KEY = '@limpix_user';

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateCurrentUser: (updated: User) => Promise<void>;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'client' | 'provider';
  address?: string;
}

/**
 * NOTE: This is a local-only demo auth implementation.
 * In a production app, authentication MUST be handled by a secure backend service
 * (e.g., Firebase Auth, Supabase, or a custom API). Never store credentials locally
 * in a production app.
 *
 * Passwords are hashed with SHA-256 before storage to avoid plain-text exposure,
 * but this is NOT a substitute for a proper backend auth system.
 */
const PASSWORDS_KEY = '@limpix_passwords';

async function hashPassword(password: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

async function getPasswords(): Promise<Record<string, string>> {
  const raw = await AsyncStorage.getItem(PASSWORDS_KEY);
  return raw ? JSON.parse(raw) : {};
}

async function savePassword(email: string, password: string): Promise<void> {
  const all = await getPasswords();
  all[email.toLowerCase()] = await hashPassword(password);
  await AsyncStorage.setItem(PASSWORDS_KEY, JSON.stringify(all));
}

function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isLoading: true });

  // Restore session on mount
  useEffect(() => {
    AsyncStorage.getItem(AUTH_KEY)
      .then(raw => {
        const user: User | null = raw ? JSON.parse(raw) : null;
        setState({ user, isLoading: false });
      })
      .catch(() => setState({ user: null, isLoading: false }));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const passwords = await getPasswords();
    const stored = passwords[email.toLowerCase()];
    if (!stored) {
      return { success: false, error: 'E-mail não encontrado.' };
    }
    const hashed = await hashPassword(password);
    if (stored !== hashed) {
      return { success: false, error: 'Senha incorreta.' };
    }
    const user = await getUserByEmail(email.toLowerCase());
    if (!user) {
      return { success: false, error: 'Usuário não encontrado.' };
    }
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
    setState({ user, isLoading: false });
    return { success: true };
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const existing = await getUserByEmail(data.email.toLowerCase());
    if (existing) {
      return { success: false, error: 'E-mail já cadastrado.' };
    }
    const user: User = {
      id: generateId(),
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      role: data.role,
      address: data.address?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    await createUser(user);
    await savePassword(data.email.toLowerCase(), data.password);
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
    setState({ user, isLoading: false });
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    setState({ user: null, isLoading: false });
  }, []);

  const updateCurrentUser = useCallback(async (updated: User) => {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(updated));
    setState(prev => ({ ...prev, user: updated }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
