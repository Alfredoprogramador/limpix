/**
 * Firebase Authentication Service
 * Substitui a autenticação local do AuthContext
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword as firebaseUpdatePassword,
} from 'firebase/auth';
import { auth } from '../config/firebase.config';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
}

// ─── Sign Up ───────────────────────────────────────────────────────────────────
export async function signUp(data: RegisterData): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // Atualizar nome do usuário
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: data.displayName,
      });
    }

    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        displayName: data.displayName,
        photoURL: userCredential.user.photoURL,
      },
    };
  } catch (error: any) {
    console.error('Sign up error:', error);

    let errorMessage = 'Erro ao criar conta.';

    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Este e-mail já está cadastrado.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'E-mail inválido.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Erro de conexão. Verifique sua internet.';
        break;
    }

    return { success: false, error: errorMessage };
  }
}

// ─── Sign In ───────────────────────────────────────────────────────────────────
export async function signIn(email: string, password: string): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      },
    };
  } catch (error: any) {
    console.error('Sign in error:', error);

    let errorMessage = 'Erro ao fazer login.';

    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'Usuário não encontrado.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Senha incorreta.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'E-mail inválido.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Conta desabilitada.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Erro de conexão. Verifique sua internet.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
        break;
    }

    return { success: false, error: errorMessage };
  }
}

// ─── Sign Out ──────────────────────────────────────────────────────────────────
export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

// ─── Auth State Observer ───────────────────────────────────────────────────────
export function onAuthChange(callback: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      callback({
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      });
    } else {
      callback(null);
    }
  });
}

// ─── Get Current User ──────────────────────────────────────────────────────────
export function getCurrentUser(): AuthUser | null {
  const user = auth.currentUser;
  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email!,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

// ─── Update Profile ────────────────────────────────────────────────────────────
export async function updateUserProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');

    await updateProfile(user, updates);
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
}

// ─── Reset Password ────────────────────────────────────────────────────────────
export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    console.error('Reset password error:', error);

    let errorMessage = 'Erro ao enviar e-mail de recuperação.';

    if (error.code === 'auth/user-not-found') {
      errorMessage = 'E-mail não encontrado.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'E-mail inválido.';
    }

    return { success: false, error: errorMessage };
  }
}

// ─── Change Password ───────────────────────────────────────────────────────────
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    // Re-autenticar antes de mudar senha
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Atualizar senha
    await firebaseUpdatePassword(user, newPassword);

    return { success: true };
  } catch (error: any) {
    console.error('Change password error:', error);

    let errorMessage = 'Erro ao alterar senha.';

    if (error.code === 'auth/wrong-password') {
      errorMessage = 'Senha atual incorreta.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Nova senha muito fraca.';
    }

    return { success: false, error: errorMessage };
  }
}

// ─── Delete Account ────────────────────────────────────────────────────────────
export async function deleteAccount(): Promise<{ success: boolean; error?: string }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    await user.delete();
    return { success: true };
  } catch (error: any) {
    console.error('Delete account error:', error);

    let errorMessage = 'Erro ao deletar conta.';

    if (error.code === 'auth/requires-recent-login') {
      errorMessage = 'Por favor, faça login novamente para deletar sua conta.';
    }

    return { success: false, error: errorMessage };
  }
}
