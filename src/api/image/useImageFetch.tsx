import axios from "@/api/axios.ts";
import { useQuery } from "@tanstack/react-query";
import { loadFromLocalStorage, saveToLocalStorage, isCacheStale } from "@/utils/chrome-storage";

export interface Image {
    id: number;
    thumbnail_url: string;
    original_image_url: string;
    page_url: string;
    tags: string;
    photographer: string;
    photographer_url: string;
}

export interface ImageResponse {
    images: Image[];
    timestamp?: number;
}

export const imagesKeys = {
    all: ["images"] as const,
    lists: () => [...imagesKeys.all, "list"] as const,
} as const;

const IMAGES_CACHE_KEY = 'cached_images';
const IMAGES_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useImageFetch = () => {
    const fetchImages = async (): Promise<ImageResponse> => {
        // Try to get cached images first
        try {
            const cachedData = await loadFromLocalStorage<ImageResponse>(IMAGES_CACHE_KEY);
            
            // If we have valid cached data that isn't stale, use it
            if (
                cachedData && 
                cachedData.images && 
                cachedData.images.length > 0 &&
                cachedData.timestamp && 
                !isCacheStale(cachedData.timestamp, IMAGES_CACHE_TTL)
            ) {
                console.log("Using cached images data");
                return cachedData;
            }
        } catch (error) {
            console.error("Error loading cached images:", error);
            // Continue with API fetch on cache error
        }
        
        // If no valid cache, fetch from API
        console.log("Fetching fresh images data from API");
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const response = await axios.get("/extension/images/", {
            headers: { "Time-Zone": timezone },
        });
        
        console.log("Raw API response:", response.data);

        let images = [];
        if (response.data?.images) {
            images = response.data.images;
        } else if (Array.isArray(response.data)) {
            images = response.data;
        } else {
            console.warn("Unexpected response format:", response.data);
            images = [];
        }

        // Construct response with timestamp
        const imageResponse: ImageResponse = {
            images,
            timestamp: Date.now()
        };

        // Cache the fresh data
        try {
            await saveToLocalStorage(IMAGES_CACHE_KEY, imageResponse);
        } catch (error) {
            console.error("Error caching images data:", error);
        }

        return imageResponse;
    };

    return useQuery({
        queryKey: imagesKeys.lists(),
        queryFn: fetchImages,
        refetchOnWindowFocus: false,
        staleTime: IMAGES_CACHE_TTL, // Match the cache TTL
    });
};