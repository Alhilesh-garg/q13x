export const DEFAULT_API_BASE = 'https://wxc1.onrender.com';
export const DEFAULT_BASE_DOMAIN = 'q13x-three.vercel.app';
export const DEFAULT_FRONTEND_URL = 'https://q13x-three.vercel.app';

export function getStoreDirectUrl(subdomain: string, baseDomain: string = DEFAULT_BASE_DOMAIN): string {
  return `https://${baseDomain}/${subdomain}`;
}

export function getStoreSubdomainUrl(subdomain: string, baseDomain: string = DEFAULT_BASE_DOMAIN): string {
  return `https://${subdomain}.${baseDomain}`;
}

export interface ImageUploadItem {
  id: string;
  previewUrl: string;
  status: 'uploading' | 'done' | 'error';
  url?: string;
  error?: string;
}

export interface StorePayload {
  subdomain: string;
  title: string;
  tagline: string;
  socials: string[];
  images: string[];
  editPassword?: string;
}

export interface PublicStoreData {
  subdomain: string;
  title: string;
  tagline: string;
  socials: string[];
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Resize and re-encode image file to compressed JPEG base64 before sending over network
 */
export async function compressImage(file: File, maxDim = 1600, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Canvas context not available'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      const base64 = dataUrl.split(',')[1];
      resolve(base64);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };
    img.src = objectUrl;
  });
}

/**
 * Upload single image to ImgBB via backend proxy
 */
export async function uploadImageToBackend(
  file: File,
  apiBase: string = DEFAULT_API_BASE
): Promise<string> {
  const base64 = await compressImage(file);
  const cleanBase = apiBase.replace(/\/$/, '');
  const res = await fetch(`${cleanBase}/api/upload-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64 }),
  });
  const data = await res.json();
  if (!res.ok || !data.success || !data.imageUrl) {
    throw new Error(data.error || 'Image upload failed');
  }
  return data.imageUrl;
}

/**
 * Check if a subdomain is available
 */
export async function checkSubdomainAvailable(
  subdomain: string,
  apiBase: string = DEFAULT_API_BASE
): Promise<{ available: boolean; error?: string }> {
  const cleanBase = apiBase.replace(/\/$/, '');
  const res = await fetch(`${cleanBase}/api/store/check-subdomain/${encodeURIComponent(subdomain)}`);
  const data = await res.json();
  if (data.success && data.available) {
    return { available: true };
  }
  return { available: false, error: data.error || 'Subdomain already taken' };
}

/**
 * Create a new store with 6-digit PIN
 */
export async function createStoreOnBackend(
  payload: StorePayload,
  apiBase: string = DEFAULT_API_BASE
): Promise<{ success: boolean; storeUrl?: string; message?: string }> {
  const cleanBase = apiBase.replace(/\/$/, '');
  const res = await fetch(`${cleanBase}/api/store/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to create store');
  }
  return data;
}

/**
 * Unlock existing store with 6-digit PIN for editing
 */
export async function unlockStoreForEdit(
  subdomain: string,
  editPassword: string,
  apiBase: string = DEFAULT_API_BASE
): Promise<{ success: boolean; store: PublicStoreData }> {
  const cleanBase = apiBase.replace(/\/$/, '');
  const res = await fetch(`${cleanBase}/api/store/unlock-for-edit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subdomain, editPassword }),
  });
  const data = await res.json();
  if (!res.ok || !data.success || !data.store) {
    throw new Error(data.error || 'Invalid subdomain or 6-digit PIN');
  }
  return data;
}

/**
 * Update existing store with 6-digit PIN
 */
export async function updateStoreOnBackend(
  payload: StorePayload,
  apiBase: string = DEFAULT_API_BASE
): Promise<{ success: boolean; message?: string }> {
  const cleanBase = apiBase.replace(/\/$/, '');
  const res = await fetch(`${cleanBase}/api/store/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to update store');
  }
  return data;
}

/**
 * Fetch public store data by subdomain
 */
export async function fetchPublicStore(
  subdomain: string,
  apiBase: string = DEFAULT_API_BASE
): Promise<PublicStoreData> {
  const cleanBase = apiBase.replace(/\/$/, '');
  const res = await fetch(`${cleanBase}/api/store/public/${encodeURIComponent(subdomain)}`);
  const data = await res.json();
  if (!res.ok || !data.success || !data.store) {
    throw new Error(data.error || 'Store not found');
  }
  return data.store;
}
