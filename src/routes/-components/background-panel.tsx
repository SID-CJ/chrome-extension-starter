import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
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

interface ColorPaletteProps {
  currentBackground: string
  setCurrentBackground: (background: string) => void
}

export default function ColorPalette({ currentBackground, setCurrentBackground }: ColorPaletteProps) {
  const [selectedBackground, setSelectedBackground] = useState(currentBackground)

  const handleBackgroundChange = (background: string) => {
    setSelectedBackground(background)
    setCurrentBackground(background)
  }

  return (
    <div className="w-120 flex h-screen bg-[#ffffff]">
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-6 w-6 text-[#000000]" />
            </Button>
            <h1 className="text-2xl font-bold text-[#000000]">Solid colors</h1>
          </div>

          <Separator className="my-4 bg-[#d9d9d9]" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {backgroundOptions.map((option) => (
              <Card
                key={option.name}
                className={`aspect-square border-2 cursor-pointer ${
                  selectedBackground === option.value ? "border-blue-500" : "border-[#d9d9d9]"
                }`}
                style={{ background: option.value }}
                onClick={() => handleBackgroundChange(option.value)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}