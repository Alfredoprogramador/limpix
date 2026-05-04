/**
 * AuthContext com Firebase
 * Substitui a autenticação local
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import {
  signUp,
  signIn,
  logout,
  onAuthChange,
  AuthUser,
} from '../services/firebaseAuth';
import {
  createUserDoc,
  getUserDoc,
  updateUserDoc,
  createProviderDoc,
} from '../services/firebaseDatabase';

interface AuthState {
  user: User | null;
  firebaseUser: AuthUser | null;
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
  role: UserRole;
  address?: string;

  // Provider specific
  city?: string;
  neighborhood?: string;
  description?: string;
  priceRange?: string;
  whatsapp?: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProviderFirebase({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    firebaseUser: null,
    isLoading: true,
  });

  // Listen to Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Load user data from Firestore
        try {
          const userData = await getUserDoc(firebaseUser.uid);
          setState({
            user: userData,
            firebaseUser,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error loading user data:', error);
          setState({
            user: null,
            firebaseUser: null,
            isLoading: false,
          });
        }
      } else {
        setState({
          user: null,
          firebaseUser: null,
          isLoading: false,
        });
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const result = await signIn(email, password);

    if (result.success && result.user) {
      // User data will be loaded by onAuthChange listener
      return { success: true };
    }

    return { success: false, error: result.error };
  }, []);

  const handleRegister = useCallback(async (data: RegisterData) => {
    // 1. Create Firebase Auth user
    const authResult = await signUp({
      email: data.email,
      password: data.password,
      displayName: data.name,
    });

    if (!authResult.success || !authResult.user) {
      return { success: false, error: authResult.error };
    }

    try {
      // 2. Create user document in Firestore
      const userData: Omit<User, 'id'> = {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        role: data.role,
        address: data.address,
        createdAt: new Date().toISOString(),
      };

      await createUserDoc(authResult.user.uid, userData);

      // 3. If provider, create provider document
      if (data.role === 'provider') {
        await createProviderDoc(authResult.user.uid, {
          ...userData,
          role: 'provider',
          services: [],
          description: data.description || '',
          city: data.city || '',
          neighborhood: data.neighborhood || '',
          whatsapp: data.whatsapp || data.phone,
          available: true,
          priceRange: data.priceRange || 'A combinar',
          rating: 0,
          reviewCount: 0,
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error creating user document:', error);

      // If Firestore fails, we should ideally delete the auth user
      // But for now, let them login and fix data manually

      return {
        success: false,
        error: 'Conta criada, mas erro ao salvar dados. Tente fazer login.',
      };
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    setState({
      user: null,
      firebaseUser: null,
      isLoading: false,
    });
  }, []);

  const updateCurrentUser = useCallback(async (updated: User) => {
    if (!state.firebaseUser) {
      throw new Error('No user logged in');
    }

    await updateUserDoc(state.firebaseUser.uid, updated);

    setState(prev => ({
      ...prev,
      user: updated,
    }));
  }, [state.firebaseUser]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthFirebase(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthFirebase must be used within AuthProviderFirebase');
  return ctx;
}
