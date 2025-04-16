import { useQuoteFetch, Quote as QuoteType } from "@/api/quotes/useQuoteFetch";
import { useEffect, useState } from "react";

export default function Quote() {
  const { data, isLoading, error } = useQuoteFetch();
  const [selectedQuote, setSelectedQuote] = useState<QuoteType | null>(null);

  useEffect(() => {
    if (data?.quotes && data.quotes.length > 0) {
      // Select a random quote from the fetched quotes
      const randomIndex = Math.floor(Math.random() * data.quotes.length);
      setSelectedQuote(data.quotes[randomIndex]);
    }
  }, [data]);

  if (isLoading) {
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