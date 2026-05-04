/**
 * Firebase Storage Service
 * Upload de fotos de perfil e documentos
 */

import {
  ref,
  uploadBytes,
  uploadString,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { storage } from '../config/firebase.config';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface UploadResult {
  url: string;
  path: string;
}

// ─── Upload Functions ──────────────────────────────────────────────────────────

/**
 * Upload profile picture
 */
export async function uploadProfilePicture(
  userId: string,
  imageUri: string
): Promise<UploadResult> {
  try {
    const filename = `profile_${Date.now()}.jpg`;
    const storageRef = ref(storage, `users/${userId}/profile/${filename}`);

    // Convert URI to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Upload
    await uploadBytes(storageRef, blob);

    // Get download URL
    const url = await getDownloadURL(storageRef);

    return {
      url,
      path: storageRef.fullPath,
    };
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
}

/**
 * Upload provider portfolio image
 */
export async function uploadPortfolioImage(
  providerId: string,
  imageUri: string,
  index: number
): Promise<UploadResult> {
  try {
    const filename = `portfolio_${index}_${Date.now()}.jpg`;
    const storageRef = ref(storage, `providers/${providerId}/portfolio/${filename}`);

    const response = await fetch(imageUri);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);

    return {
      url,
      path: storageRef.fullPath,
    };
  } catch (error) {
    console.error('Error uploading portfolio image:', error);
    throw error;
  }
}

/**
 * Upload document (CPF, RG, etc.)
 */
export async function uploadDocument(
  userId: string,
  documentType: string,
  imageUri: string
): Promise<UploadResult> {
  try {
    const filename = `${documentType}_${Date.now()}.jpg`;
    const storageRef = ref(storage, `users/${userId}/documents/${filename}`);

    const response = await fetch(imageUri);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);

    return {
      url,
      path: storageRef.fullPath,
    };
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
}

/**
 * Upload base64 image
 */
export async function uploadBase64Image(
  path: string,
  base64Data: string,
  metadata?: any
): Promise<UploadResult> {
  try {
    const storageRef = ref(storage, path);

    await uploadString(storageRef, base64Data, 'base64', metadata);
    const url = await getDownloadURL(storageRef);

    return {
      url,
      path: storageRef.fullPath,
    };
  } catch (error) {
    console.error('Error uploading base64 image:', error);
    throw error;
  }
}

// ─── Download Functions ────────────────────────────────────────────────────────

/**
 * Get download URL for a file
 */
export async function getFileURL(path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
}

/**
 * Get all portfolio images for a provider
 */
export async function getProviderPortfolio(providerId: string): Promise<string[]> {
  try {
    const folderRef = ref(storage, `providers/${providerId}/portfolio`);
    const result = await listAll(folderRef);

    const urls = await Promise.all(
      result.items.map(itemRef => getDownloadURL(itemRef))
    );

    return urls;
  } catch (error) {
    console.error('Error getting provider portfolio:', error);
    return []; // Return empty array if folder doesn't exist
  }
}

// ─── Delete Functions ──────────────────────────────────────────────────────────

/**
 * Delete a file by path
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Delete all files in a folder
 */
export async function deleteFolder(folderPath: string): Promise<void> {
  try {
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);

    // Delete all files
    await Promise.all(
      result.items.map(itemRef => deleteObject(itemRef))
    );

    // Recursively delete subfolders
    await Promise.all(
      result.prefixes.map(prefixRef => deleteFolder(prefixRef.fullPath))
    );
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
}

/**
 * Delete all user data from storage
 */
export async function deleteUserStorage(userId: string): Promise<void> {
  try {
    await deleteFolder(`users/${userId}`);
    await deleteFolder(`providers/${userId}`);
  } catch (error) {
    console.error('Error deleting user storage:', error);
    // Don't throw - user might not have any files
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Get file size in bytes
 */
export function getImageSize(uri: string): Promise<number> {
  return new Promise((resolve, reject) => {
    fetch(uri)
      .then(response => response.blob())
      .then(blob => resolve(blob.size))
      .catch(reject);
  });
}

/**
 * Compress image before upload (opcional - requer expo-image-manipulator)
 */
export async function compressImage(uri: string, quality: number = 0.7): Promise<string> {
  try {
    // TODO: Implement with expo-image-manipulator if needed
    // import * as ImageManipulator from 'expo-image-manipulator';

    // const result = await ImageManipulator.manipulateAsync(
    //   uri,
    //   [{ resize: { width: 1024 } }],
    //   { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
    // );

    // return result.uri;

    return uri; // Return original for now
  } catch (error) {
    console.error('Error compressing image:', error);
    return uri;
  }
}

/**
 * Validate image size (max 5MB)
 */
export async function validateImageSize(uri: string, maxSizeMB: number = 5): Promise<boolean> {
  try {
    const size = await getImageSize(uri);
    const sizeMB = size / (1024 * 1024);
    return sizeMB <= maxSizeMB;
  } catch (error) {
    console.error('Error validating image size:', error);
    return false;
  }
}
