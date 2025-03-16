
import { useState } from "react"

const backgroundOptions = [
  { name: "Purple Gradient", value: "linear-gradient(to bottom right, #4a3b78, #8a56a0)" },
  { name: "Blue Gradient", value: "linear-gradient(to bottom right, #1a2980, #26d0ce)" },
  { name: "Sunset", value: "linear-gradient(to bottom right, #ff7e5f, #feb47b)" },
  { name: "Forest", value: "linear-gradient(to bottom right, #134e5e, #71b280)" },
  { name: "Ocean", value: "linear-gradient(to bottom right, #2980b9, #6dd5fa)" },
  { name: "Midnight", value: "linear-gradient(to bottom right, #232526, #414345)" },
  { name: "Cherry", value: "linear-gradient(to bottom right, #eb3349, #f45c43)" },
  { name: "Solid Black", value: "#121212" },
  { name: "Solid White", value: "#ffffff" },
]

interface BackgroundPanelProps {
  currentBackground: string
  setCurrentBackground: (background: string) => void
}

export default function BackgroundPanel({ currentBackground, setCurrentBackground }: BackgroundPanelProps) {
  const [selectedBackground, setSelectedBackground] = useState(currentBackground)

  const handleBackgroundChange = (background: string) => {
    setSelectedBackground(background)
    setCurrentBackground(background)
  }

  return (
    <div className="bg-white border-r border-gray-200 w-120 h-full p-4 shadow-lg overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Background Settings</h2>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">Choose a background style:</p>
        
        <div className="grid grid-cols-2 gap-3">
          {backgroundOptions.map((option) => (
            <div
              key={option.name}
              className={`cursor-pointer rounded-md border-2 p-1 ${
                selectedBackground === option.value ? "border-blue-500" : "border-gray-200"
              }`}
              onClick={() => handleBackgroundChange(option.value)}
            >
              <div
                className="h-16 w-full rounded-sm"
                style={{ background: option.value }}
              ></div>
              <p className="text-xs mt-1 text-center">{option.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}