// Define the shape of our settings
export interface AppSettings {
  darkMode: boolean;
  language: string;
  timeFormat: string;
  dateFormat: string;
  quoteFrequency: string;
  timeAndDateVisible: boolean;
  quotesVisible: boolean;
  currentBackground: string;
  currentPhotographer: string;
  pageUrl?: string;
  blurAmount: number;
}

// Default settings
export const defaultSettings: AppSettings = {
  darkMode: false,
  language: "en",
  timeFormat: "12h",
  dateFormat: "mdy",
  quoteFrequency: "daily",
  timeAndDateVisible: true,
  quotesVisible: true,
  currentBackground: " #4a3b78",
  currentPhotographer: "",
  pageUrl:"",
  blurAmount: 0,
};

/**
 * Save settings to Chrome sync storage
 */
export const saveSettings = async (settings: Partial<AppSettings>): Promise<void> => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.sync.set(settings, () => {
        resolve();
      });
    });
  } else {
    // Fallback for development environments without Chrome API
    console.log('Chrome storage not available, using localStorage');
    Object.entries(settings).forEach(([key, value]) => {
      localStorage.setItem(`app_settings_${key}`, JSON.stringify(value));
    });
    return Promise.resolve();
  }
};

/**
 * Load all settings from Chrome sync storage
 */
export const loadSettings = async (): Promise<AppSettings> => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(Object.keys(defaultSettings), (items) => {
        resolve({ ...defaultSettings, ...items } as AppSettings);
      });
    });
  } else {
    // Fallback for development environments without Chrome API
    const settings = { ...defaultSettings };
    Object.keys(defaultSettings).forEach((key) => {
      const storedValue = localStorage.getItem(`app_settings_${key}`);
      if (storedValue) {
        const parsedValue = JSON.parse(storedValue);
        (settings as Record<keyof AppSettings, unknown>)[key as keyof AppSettings] = parsedValue;
      }
    });
    return Promise.resolve(settings);
  }
};

/**
 * Save data to Chrome local storage
 */
export const saveToLocalStorage = async <T>(key: string, data: T): Promise<void> => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: data }, () => {
        resolve();
      });
    });
  } else {
    // Fallback for development environments without Chrome API
    localStorage.setItem(key, JSON.stringify(data));
    return Promise.resolve();
  }
};

/**
 * Load data from Chrome local storage
 */
export const loadFromLocalStorage = async <T>(key: string): Promise<T | null> => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key] || null);
      });
    });
  } else {
    // Fallback for development environments without Chrome API
    const data = localStorage.getItem(key);
    return Promise.resolve(data ? JSON.parse(data) : null);
  }
};

/**
 * Check if data in cache is stale based on timestamp and TTL
 */
export const isCacheStale = (timestamp: number, ttlMs: number): boolean => {
  return Date.now() - timestamp > ttlMs;
};

/**
 * Listen for settings changes from other tabs/windows
 */
export const listenForSettingsChanges = (callback: (changes: Partial<AppSettings>) => void): (() => void) => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    const listener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName === 'sync') {
        const changedSettings: Partial<AppSettings> = {};
        Object.keys(changes).forEach(key => {
          changedSettings[key as keyof AppSettings] = changes[key].newValue;
        });
        callback(changedSettings);
      }
    };
    
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }
  
  // Return a no-op cleanup function if not in Chrome extension environment
  return () => {};
};
