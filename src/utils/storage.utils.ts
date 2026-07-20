const storage = {
  get<T = string>(key: string, fallback?: T): T | null {
    if (typeof window === 'undefined') return fallback ?? null;
    const value = window.localStorage.getItem(key);
    if (!value) return fallback ?? null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  },
  set(key: string, value: unknown) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  },
  remove(key: string) {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },
  clear() {
    if (typeof window === 'undefined') return;
    window.localStorage.clear();
  },
};

export { storage };
