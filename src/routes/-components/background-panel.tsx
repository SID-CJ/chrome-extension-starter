import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { useState } from "react"

const backgroundOptions = [
  { name: "Grey", value: "#757575" },
  { name: "Blue", value: "#4285F4" },
  { name: "Aqua", value: "#00ACC1" },
  { name: "Green", value: "#0F9D58" },
  { name: "Viridian", value: "#1E8E3E" },
  { name: "Cool Grey", value: "#9AA0A6" },
  { name: "Citron", value: "#F4B400" },
  { name: "Orange", value: "#FA7B17" },
  { name: "Apricot", value: "#F6AE2D" },
  { name: "Rose", value: "#DB4437" },
  { name: "Pink", value: "#E91E63" },
  { name: "Fuchsia", value: "#A142F4" },
  { name: "Violet", value: "#673AB7" },
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
                className={`aspect-square border-2 cursor-pointer rounded-none max-w-[180px] ${
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