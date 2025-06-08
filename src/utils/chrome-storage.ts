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
  dateFormat: "default",
  quoteFrequency: "hourly",
  timeAndDateVisible: true,
  quotesVisible: true,
  currentBackground: "#000000", // Changed from " #4a3b78" to black
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
  // First check if this is a first-time user
  const isFirstTimeUser = await isNewUser();
  
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(Object.keys(defaultSettings), (items) => {
        const settings = { ...defaultSettings, ...items } as AppSettings;
        
        // For new users, ensure background is set to black regardless of any cached settings
        if (isFirstTimeUser) {
          settings.currentBackground = "#000000";
          settings.currentPhotographer = "";
          settings.pageUrl = "";
        }
        
        resolve(settings);
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
    
    // For new users, ensure background is set to black in local storage fallback as well
    if (isFirstTimeUser) {
      settings.currentBackground = "#000000";
      settings.currentPhotographer = "";
      settings.pageUrl = "";
    }
    
    return Promise.resolve(settings);
  }
};

/**
 * Check if this is a new user (first time opening the extension)
 */
export const isNewUser = async (): Promise<boolean> => {
  const userInitializedKey = 'extension_initialized';
  
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.local.get([userInitializedKey], (result) => {
        const isNew = !result[userInitializedKey];
        
        // If this is a new user, set the flag to remember for next time
        if (isNew) {
          chrome.storage.local.set({ [userInitializedKey]: true });
        }
        
        resolve(isNew);
      });
    });
  } else {
    // Fallback for development environments
    const initialized = localStorage.getItem(userInitializedKey);
    const isNew = !initialized;
    
    // If this is a new user, set the flag to remember for next time
    if (isNew) {
      localStorage.setItem(userInitializedKey, 'true');
    }
    
    return Promise.resolve(isNew);
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
