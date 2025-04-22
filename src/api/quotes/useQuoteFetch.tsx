import axios from "@/api/axios.ts";
import { useQuery } from "@tanstack/react-query";

export interface Quote {
    id: string;
    quote: string;
    author: string;
    mood: string;
    time: string;
}

export interface QuoteResponse {
    quotes: Quote[];
}

export const quotesKeys = {
    all: ["quotes"] as const,
    lists: () => [...quotesKeys.all, "list"] as const,
} as const;

// Fetch function separated from hook
const fetchQuotes = async (): Promise<QuoteResponse> => {
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

    return {
        quotes,
    };
};

// Update your useQuoteFetch hook to always fetch fresh data
export const useQuoteFetch = () => {
  const query = useQuery<QuoteResponse, Error>({
    queryKey: ['quotes'],
    queryFn: fetchQuotes,
    refetchOnWindowFocus: false,
    staleTime: 0,  // Consider data always stale for testing
  });
  
  return query; // This includes data, isLoading, error, and refetch
};