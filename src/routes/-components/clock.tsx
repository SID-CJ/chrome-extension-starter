
import { useState, useEffect } from "react"

interface ClockProps {
  currentTime: Date
}

export default function Clock({ currentTime }: ClockProps) {
  const [formattedTime, setFormattedTime] = useState("")
  const [formattedDate, setFormattedDate] = useState("")

  useEffect(() => {
    // Format time as HH:MM
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes().toString().padStart(2, "0")
    setFormattedTime(`${hours}:${minutes}`)

    // Format date as Weekday, Month Day
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    }
    setFormattedDate(currentTime.toLocaleDateString("en-US", options))
  }, [currentTime])

  return (
    <div className="text-center text-white">
      <h1 className="text-8xl font-light mb-2">{formattedTime}</h1>
      <p className="text-xl opacity-90">{formattedDate}</p>
    </div>
  )
}

