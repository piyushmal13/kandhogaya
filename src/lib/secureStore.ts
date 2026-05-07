import CryptoJS from 'crypto-js';
import { set, get, del } from 'idb-keyval';

// 256-bit base64 secret from environment. In dev, uses a safe fallback.
// 256-bit secret from environment. Robust fallback for development.
const SECRET_RAW = import.meta.env.VITE_CLIENT_STORAGE_SECRET || "ifxtrades_institutional_sovereign_secret_256";
const SECRET = CryptoJS.enc.Utf8.parse(SECRET_RAW);

export async function setSecureItem(key: string, value: any) {
  try {
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      SECRET
    ).toString();
    await set(key, ciphertext);
  } catch (error) {
    console.error(`Secure storage encoding failed for ${key}`, error);
  }
}

export async function getSecureItem<T>(key: string): Promise<T | null> {
  try {
    const ciphertext = await get<string>(key);
    if (!ciphertext || typeof ciphertext !== 'string') return null;
    
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET);
    const json = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!json) {
      console.warn(`[SecureStore] Decryption returned empty string for ${key}. Possible secret mismatch.`);
      return null;
    }
    
    return JSON.parse(json) as T;
  } catch (error) {
    console.error(`Secure storage decoding failed for ${key}`, error);
    // Cleanup corrupted item
    await del(key);
    return null;
  }
}

export async function removeSecureItem(key: string) {
    await del(key);
}
