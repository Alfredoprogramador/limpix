/**
 * Firebase Configuration for Limpix
 * 
 * INSTRUÇÕES:
 * 1. Acesse https://console.firebase.google.com
 * 2. Crie um novo projeto chamado "Limpix"
 * 3. Vá em Project Settings > Your apps
 * 4. Clique em "Web" (</>) para adicionar um app web
 * 5. Copie as credenciais e cole aqui
 * 6. Ative os serviços no console:
 *    - Authentication (Email/Password)
 *    - Firestore Database
 *    - Storage
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth,
  initializeAuth,
  // @ts-ignore - React Native persistence
  getReactNativePersistence 
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ SUBSTITUA COM SUAS CREDENCIAIS DO FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "limpix-xxxxx.firebaseapp.com",
  projectId: "limpix-xxxxx",
  storageBucket: "limpix-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  // measurementId: "G-XXXXXXXXXX" // Opcional (Analytics)
};

// Inicializa Firebase apenas uma vez
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);

  // Inicializa Auth com persistência para React Native
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });

  db = getFirestore(app);
  storage = getStorage(app);
} else {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, auth, db, storage };

// Helper para verificar se Firebase está configurado
export function isFirebaseConfigured(): boolean {
  return firebaseConfig.apiKey !== "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
}

// Log de status
console.log('🔥 Firebase initialized:', isFirebaseConfigured() ? 'YES' : 'NO - Please configure firebase.config.ts');
