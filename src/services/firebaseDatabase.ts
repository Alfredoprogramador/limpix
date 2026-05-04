/**
 * Firebase Firestore Service
 * Substitui o SQLite local
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
  addDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { User, ServiceProvider, Booking, Review } from '../types';

// ─── Collections ───────────────────────────────────────────────────────────────
const COLLECTIONS = {
  users: 'users',
  providers: 'providers',
  bookings: 'bookings',
  reviews: 'reviews',
};

// ─── Users ─────────────────────────────────────────────────────────────────────

export async function createUserDoc(userId: string, userData: Omit<User, 'id'>): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.users, userId), {
      ...userData,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error creating user doc:', error);
    throw error;
  }
}

export async function getUserDoc(userId: string): Promise<User | null> {
  try {
    const docRef = doc(db, COLLECTIONS.users, userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as User;
  } catch (error) {
    console.error('Error getting user doc:', error);
    throw error;
  }
}

export async function updateUserDoc(userId: string, updates: Partial<User>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.users, userId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating user doc:', error);
    throw error;
  }
}

export async function getUserByEmailFirestore(email: string): Promise<User | null> {
  try {
    const q = query(
      collection(db, COLLECTIONS.users),
      where('email', '==', email.toLowerCase()),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const docSnap = querySnapshot.docs[0];
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as User;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

// ─── Providers ─────────────────────────────────────────────────────────────────

export async function createProviderDoc(providerId: string, providerData: Omit<ServiceProvider, 'id'>): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.providers, providerId), {
      ...providerData,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error creating provider doc:', error);
    throw error;
  }
}

export async function getProviderDoc(providerId: string): Promise<ServiceProvider | null> {
  try {
    const docRef = doc(db, COLLECTIONS.providers, providerId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as ServiceProvider;
  } catch (error) {
    console.error('Error getting provider doc:', error);
    throw error;
  }
}

export async function updateProviderDoc(providerId: string, updates: Partial<ServiceProvider>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.providers, providerId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating provider doc:', error);
    throw error;
  }
}

export async function getProvidersFirestore(serviceFilter?: string): Promise<ServiceProvider[]> {
  try {
    const constraints: QueryConstraint[] = [];

    if (serviceFilter) {
      constraints.push(where('services', 'array-contains', serviceFilter));
    }

    constraints.push(orderBy('rating', 'desc'));

    const q = query(collection(db, COLLECTIONS.providers), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ServiceProvider[];
  } catch (error) {
    console.error('Error getting providers:', error);
    throw error;
  }
}

// ─── Bookings ──────────────────────────────────────────────────────────────────

export async function createBookingFirestore(bookingData: Omit<Booking, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.bookings), {
      ...bookingData,
      createdAt: Timestamp.now(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

export async function getBookingsByClientFirestore(clientId: string): Promise<Booking[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.bookings),
      where('clientId', '==', clientId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Booking[];
  } catch (error) {
    console.error('Error getting bookings by client:', error);
    throw error;
  }
}

export async function getBookingsByProviderFirestore(providerId: string): Promise<Booking[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.bookings),
      where('providerId', '==', providerId),
      orderBy('date', 'asc')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Booking[];
  } catch (error) {
    console.error('Error getting bookings by provider:', error);
    throw error;
  }
}

export async function updateBookingStatusFirestore(bookingId: string, status: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.bookings, bookingId);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}

export async function getBookingFirestore(bookingId: string): Promise<Booking | null> {
  try {
    const docRef = doc(db, COLLECTIONS.bookings, bookingId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Booking;
  } catch (error) {
    console.error('Error getting booking:', error);
    throw error;
  }
}

// ─── Reviews ───────────────────────────────────────────────────────────────────

export async function createReviewFirestore(reviewData: Omit<Review, 'id'>): Promise<string> {
  try {
    // Usar batch para criar review e atualizar rating do provider atomicamente
    const batch = writeBatch(db);

    // 1. Criar review
    const reviewRef = doc(collection(db, COLLECTIONS.reviews));
    batch.set(reviewRef, {
      ...reviewData,
      createdAt: Timestamp.now(),
    });

    // 2. Buscar todas as reviews do provider para calcular nova média
    const q = query(
      collection(db, COLLECTIONS.reviews),
      where('providerId', '==', reviewData.providerId)
    );
    const querySnapshot = await getDocs(q);

    const allRatings = querySnapshot.docs.map(doc => doc.data().rating);
    allRatings.push(reviewData.rating); // Adicionar nova rating

    const avgRating = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
    const reviewCount = allRatings.length;

    // 3. Atualizar provider
    const providerRef = doc(db, COLLECTIONS.providers, reviewData.providerId);
    batch.update(providerRef, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount,
    });

    await batch.commit();

    return reviewRef.id;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
}

export async function getReviewsByProviderFirestore(providerId: string): Promise<Review[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.reviews),
      where('providerId', '==', providerId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Review[];
  } catch (error) {
    console.error('Error getting reviews by provider:', error);
    throw error;
  }
}

export async function getReviewByBookingFirestore(bookingId: string): Promise<Review | null> {
  try {
    const q = query(
      collection(db, COLLECTIONS.reviews),
      where('bookingId', '==', bookingId),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const docSnap = querySnapshot.docs[0];
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Review;
  } catch (error) {
    console.error('Error getting review by booking:', error);
    throw error;
  }
}

// ─── Admin/Helpers ─────────────────────────────────────────────────────────────

export async function deleteAllUserData(userId: string): Promise<void> {
  try {
    const batch = writeBatch(db);

    // Delete user doc
    batch.delete(doc(db, COLLECTIONS.users, userId));

    // Delete provider doc if exists
    batch.delete(doc(db, COLLECTIONS.providers, userId));

    // Note: Bookings e reviews devem ser tratados separadamente
    // pois podem ter relacionamentos complexos

    await batch.commit();
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error;
  }
}
