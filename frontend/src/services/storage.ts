export const storage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem: (key: string, value: string | object): void => {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch {
      console.error(`Failed to set item in localStorage: ${key}`);
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      console.error(`Failed to remove item from localStorage: ${key}`);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch {
      console.error('Failed to clear localStorage');
    }
  },

  getJson: <T,>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  setJson: <T,>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error(`Failed to set JSON in localStorage: ${key}`);
    }
  },
};

