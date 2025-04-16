import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { useState } from "react"

const backgroundOptions = [
  { name: "Purple", value: "#4a3b78" },
  { name: "Blue", value: "#1a2980" },
  { name: "Orange", value: "#ff7e5f" },
  { name: "Forest", value: "#134e5e" },
  { name: "Ocean", value: "#2980b9" },
  { name: "Midnight", value: "#414345" },
  { name: "Cherry", value: "#eb3349" },
  { name: "Solid Black", value: "#121212" },
  { name: "Solid White", value : "#ffff00" }, 
]

interface ColorPaletteProps {
  currentBackground: string
  setCurrentBackground: (background: string) => void
  setShowBackgrounds: (show: boolean) => void
  setShowImageBackgrounds: (show: boolean) => void
}

export default function ColorPalette({
  currentBackground,
  setCurrentBackground,
  setShowBackgrounds,
}: ColorPaletteProps) {
  const [selectedBackground, setSelectedBackground] = useState(currentBackground)

  const handleBackgroundChange = (background: string) => {
    setSelectedBackground(background)
    setCurrentBackground(background)
  }

  const handleBackClick = () => {
    setShowBackgrounds(false)
  }

  return (
    <div className="w-150 flex h-screen bg-[#ffffff]">
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="icon" className="mr-2" onClick={handleBackClick}>
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