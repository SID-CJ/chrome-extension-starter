import { useQuoteFetch, Quote as QuoteType } from "@/api/quotes/useQuoteFetch";
import { useEffect, useState, useCallback } from "react";

export default function Quote() {
  const [selectedQuote, setSelectedQuote] = useState<QuoteType | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);
  
  // Create a memoized function to check if we need to fetch a new quote
  const checkShouldFetch = useCallback(() => {
    const frequency = localStorage.getItem('quoteFrequency') || 'daily';
    const lastFetchTime = localStorage.getItem('lastQuoteFetchTime');
    
    if (!lastFetchTime) {
      return true;
    }
    
    const now = Date.now();
    const lastFetch = parseInt(lastFetchTime);
    

    const hourInMs = 60*60*1000;
    const dayInMs = 24 * hourInMs;
    const weekInMs = 7 * dayInMs;
    
    switch (frequency) {
      case 'hourly':
        return (now - lastFetch) > hourInMs;
      case 'daily':
        return (now - lastFetch) > dayInMs;
      case 'weekly':
        return (now - lastFetch) > weekInMs;
      default: 
        return (now - lastFetch) > dayInMs;
    }
  }, []);

  // Initial check when component mounts
  useEffect(() => {
    if (checkShouldFetch()) {
      setShouldRefetch(true);
    } else {
      // Try to use cached quote
      try {
        const cachedQuoteString = localStorage.getItem('cachedQuote');
        if (cachedQuoteString) {
          const cachedQuote = JSON.parse(cachedQuoteString);
          setSelectedQuote(cachedQuote);
        } else {
          setShouldRefetch(true);
        }
      } catch (e) {
        console.error('Failed to parse cached quote:', e);
        setShouldRefetch(true);
      }
    }
  }, [checkShouldFetch]);
  

  useEffect(() => {
    if (!shouldRefetch) return;
    
    const timeoutId = setTimeout(() => {
      setShouldRefetch(false);
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [shouldRefetch]);
  
  // Get the quote data
  const { data, isLoading, error, refetch } = useQuoteFetch();
  
  // When shouldRefetch changes, trigger a refetch
  useEffect(() => {
    if (shouldRefetch) {
      refetch();
    }
  }, [shouldRefetch, refetch]);

  // Set the quote when data is loaded
  useEffect(() => {
    if (data?.quotes && data.quotes.length > 0) {
      // Always use the first quote from the response
      const quote = data.quotes[0];
      setSelectedQuote(quote);
      
      // Cache the quote and update the last fetch time
      localStorage.setItem('cachedQuote', JSON.stringify(quote));
      localStorage.setItem('lastQuoteFetchTime', Date.now().toString());
    }
  }, [data]);

  if (isLoading && !selectedQuote) {
    return (
      <div className="absolute bottom-16 left-0 right-0 text-center px-8">
        <p className="text-white text-lg max-w-2xl mx-auto">Loading quote...</p>
      </div>
    );
  }

  if (error || !selectedQuote) {
    return (
      <div className="absolute bottom-16 left-0 right-0 text-center px-8">
        <p className="text-white text-lg max-w-2xl mx-auto">
          Unable to load quote.
        </p>
      </div>
    );
  }

  return (
    <div className="absolute bottom-16 left-0 right-0 text-center px-8">
      <p className="text-white text-lg max-w-2xl mx-auto">
        {selectedQuote.quote}
      </p>
      <p className="text-white/70 text-sm mt-2">{selectedQuote.author}</p>
    </div>
  );
}