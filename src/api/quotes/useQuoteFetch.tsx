import axios from "@/api/axios.ts";
import { useQuery } from "@tanstack/react-query";
import { loadFromLocalStorage, saveToLocalStorage, isCacheStale } from "@/utils/chrome-storage";

export interface Quote {
    id: string;
    quote: string;
    author: string;
    mood: string;
    time: string;
}

export interface QuoteResponse {
    quotes: Quote[];
    timestamp?: number;
}

export const quotesKeys = {
    all: ["quotes"] as const,
    lists: () => [...quotesKeys.all, "list"] as const,
} as const;

const QUOTES_CACHE_KEY = 'cached_quotes';
const FREQUENCY_TO_TTL = {
    hourly: 60 * 60 * 1000,         // 1 hour
    daily: 24 * 60 * 60 * 1000,     // 24 hours
    weekly: 7 * 24 * 60 * 60 * 1000 // 1 week
};

// Fetch function separated from hook
const fetchQuotes = async (): Promise<QuoteResponse> => {
    const frequency = localStorage.getItem('quoteFrequency') || 'daily';
    const quoteTTL = FREQUENCY_TO_TTL[frequency as keyof typeof FREQUENCY_TO_TTL] || FREQUENCY_TO_TTL.daily;
    
    // Try to get cached quotes first
    try {
        const cachedData = await loadFromLocalStorage<QuoteResponse>(QUOTES_CACHE_KEY);
        
        // If we have valid cached data that isn't stale based on frequency, use it
        if (
            cachedData && 
            cachedData.quotes && 
            cachedData.quotes.length > 0 &&
            cachedData.timestamp && 
            !isCacheStale(cachedData.timestamp, quoteTTL)
        ) {
            console.log("Using cached quotes data");
            return cachedData;
        }
    } catch (error) {
        console.error("Error loading cached quotes:", error);
        // Continue with API fetch on cache error
    }
    
    // If no valid cache, fetch from API
    console.log("Fetching fresh quotes data from API");
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await axios.get("/quotes/get_quotes", {
        headers: { "Time-Zone": timezone },
    });
    
    console.log("Raw API response:", response.data);

    let quotes = [];
    if (response.data?.quotes) {
        quotes = response.data.quotes;
    } else if (Array.isArray(response.data)) {
        quotes = response.data;
    } else {
        console.warn("Unexpected response format:", response.data);
        quotes = [];
    }

    // Construct response with timestamp
    const quoteResponse: QuoteResponse = {
        quotes,
        timestamp: Date.now()
    };
    
    // Cache the fresh data
    try {
        await saveToLocalStorage(QUOTES_CACHE_KEY, quoteResponse);
    } catch (error) {
        console.error("Error caching quotes data:", error);
    }

    return quoteResponse;
};

// Update useQuoteFetch hook to use the custom fetch function with caching
export const useQuoteFetch = () => {
    const frequency = localStorage.getItem('quoteFrequency') || 'daily';
    const quoteTTL = FREQUENCY_TO_TTL[frequency as keyof typeof FREQUENCY_TO_TTL] || FREQUENCY_TO_TTL.daily;
  
    const query = useQuery<QuoteResponse, Error>({
        queryKey: ['quotes', frequency], // Include frequency in the key to refetch when it changes
        queryFn: fetchQuotes,
        refetchOnWindowFocus: false,
        staleTime: quoteTTL,  // Use TTL based on frequency
    });
  
    return query;
};