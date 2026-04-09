import CryptoJS from 'crypto-js';
import { set, get, del } from 'idb-keyval';

// 256-bit base64 secret from environment. In dev, uses a safe fallback.
const SECRET = import.meta.env.VITE_CLIENT_STORAGE_SECRET || btoa("ifxtrades_dev_fallback_secret_256");

export async function setSecureItem(key: string, value: any) {
  try {
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      CryptoJS.enc.Base64.parse(SECRET)
    ).toString();
    await set(key, ciphertext);
  } catch (error) {
    console.error(`Secure storage encoding failed for ${key}`, error);
  }
}

export async function getSecureItem<T>(key: string): Promise<T | null> {
  try {
    const ciphertext = await get<string>(key);
    if (!ciphertext) return null;
    
    const bytes = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Base64.parse(SECRET));
    const json = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(json) as T;
  } catch (error) {
    console.error(`Secure storage decoding failed for ${key}`, error);
    return null;
  }
}

export async function removeSecureItem(key: string) {
    await del(key);
}
