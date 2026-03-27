type CacheEntry = {
  data: any;
  expiry: number;
};

let cacheStore: Record<string, CacheEntry> = {};

export const getCache = (key: string) => {
  const entry = cacheStore[key];

  if (!entry) return null;

  if (Date.now() > entry.expiry) {
    delete cacheStore[key];
    return null;
  }

  return entry.data;
};

export const setCache = (key: string, data: any, ttl = 30000) => {
  cacheStore[key] = {
    data,
    expiry: Date.now() + ttl,
  };
};

export const clearCache = () => {
  cacheStore = {};
};
