import { useState } from "react"

interface Quote {
  text: string
  author: string
}

export default function Quote() {
  const [quote] = useState<Quote>({
    text: "So I'm going to look at something in as positive way as possible.",
    author: "Harris Faulkner",
  })

  // In a real implementation, you would fetch quotes from an API or local storage
  // This is just a placeholder with the quote from the design

  return (
    <div className="absolute bottom-16 left-0 right-0 text-center px-8">
      <p className="text-white text-lg max-w-2xl mx-auto">{quote.text}</p>
      <p className="text-white/70 text-sm mt-2">{quote.author}</p>
    </div>
  )
}

