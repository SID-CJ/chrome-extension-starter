// Helper functions for image caching using IndexedDB for better persistence in extensions
const DB_NAME = 'image-cache-db';
const STORE_NAME = 'images';
const DB_VERSION = 1;

// Open the IndexedDB database
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    
    request.onsuccess = () => resolve(request.result);
  });
}

// Save image blob to IndexedDB
export async function cacheImage(url: string): Promise<string> {
  try {
    console.log('Caching image:', url);

    // Fetch the image using the Fetch API
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();

    // Store in IndexedDB
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const request = store.put(blob, url);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    db.close();

    // Return object URL for immediate use
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error caching image:', error);
    return url; // Fallback to original URL
  }
}

// Get cached image from IndexedDB
export async function getCachedImage(url: string): Promise<string | null> {
  try {
    console.log('Checking cache for:', url);
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    const blob = await new Promise<Blob | null>((resolve, reject) => {
      const request = store.get(url);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
    
    db.close();
    
    if (blob) {
      console.log('Cache hit for:', url);
      return URL.createObjectURL(blob);
    }
    
    console.log('Cache miss for:', url);
    return null;
  } catch (error) {
    console.error('Error retrieving cached image:', error);
    return null;
  }
}