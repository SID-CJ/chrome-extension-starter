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
