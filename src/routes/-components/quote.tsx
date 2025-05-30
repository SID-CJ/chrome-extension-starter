import { useQuoteFetch, Quote as QuoteType } from "@/api/quotes/useQuoteFetch";
import { useState, useEffect } from "react";

export default function Quote() {
  const [selectedQuote, setSelectedQuote] = useState<QuoteType | null>(null);
  
  // Get the quote data with our improved caching
  const { data, isLoading, error } = useQuoteFetch();
  
  // Set the quote when data is loaded
  useEffect(() => {
    if (data?.quotes && data.quotes.length > 0) {
      // Always use the first quote from the response
      setSelectedQuote(data.quotes[0]);
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