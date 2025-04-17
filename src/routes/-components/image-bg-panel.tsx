import { ArrowLeft, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import { useImageFetch } from "@/api/image/useImageFetch"
import ColorPalette from "./background-panel"

interface ImageBackgroundPanelProps {
  currentBackground: string
  setCurrentBackground: (background: string) => void
  setShowImageBackgrounds: (show: boolean) => void
  currentPhotographer: string
  setCurrentPhotographer: (photographer: string) => void
}

export default function ImageBackgroundPanel({
  currentBackground,
  setCurrentBackground,
  setShowImageBackgrounds,
  setCurrentPhotographer,
}: ImageBackgroundPanelProps) {
  const [selectedBackground, setSelectedBackground] = useState(currentBackground)
  const [showBackgrounds, setShowBackgrounds] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedFrequency, setSelectedFrequency] = useState("Select an option")
  const { data, isLoading, error } = useImageFetch()

  const handleBackgroundChange = (backgroundUrl: string, photographer: string = "") => {
    setSelectedBackground(backgroundUrl)
    setCurrentBackground(backgroundUrl)
    setCurrentPhotographer(photographer)
  }

  const handleSolidColorsClick = () => {
    setShowBackgrounds(true)
    setCurrentPhotographer("")
  }

  if (showBackgrounds) {
    return (
      <ColorPalette
        currentBackground={currentBackground}
        setCurrentBackground={setCurrentBackground}
        setShowBackgrounds={setShowBackgrounds}
        setShowImageBackgrounds={setShowImageBackgrounds}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="w-150 flex h-screen bg-[#ffffff]">
        <div className="flex-1 p-4 md:p-6">
          <p>Loading images...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-150 flex h-screen bg-[#ffffff]">
        <div className="flex-1 p-4 md:p-6">
          <p>Error loading images: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-150 flex h-screen bg-[#ffffff]">
      <div className="flex-1 overflow-auto flex flex-col">
        <div className="p-4 md:p-6 flex flex-col h-full">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => setShowImageBackgrounds(false)}
            >
              <ArrowLeft className="h-6 w-6 text-[#000000]" />
            </Button>
            <h1 className="text-2xl font-bold text-[#000000]">Image Backgrounds</h1>
          </div>

          <Separator className="my-4 bg-[#d9d9d9]" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Card
              className="aspect-square border-2 cursor-pointer bg-black rounded-none max-w-[180px]"
              onClick={handleSolidColorsClick}
            >
              <div className="h-full w-full flex items-end p-2">
                <span className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                  Solid Colors
                </span>
              </div>
            </Card>

            {data?.images.map((image) => (
              <Card
                key={image.id}
                className={`aspect-square border-2 cursor-pointer bg-cover bg-center rounded-none max-w-[180px] ${
                  selectedBackground === image.original_image_url ? "border-blue-500" : "border-[#d9d9d9]"
                }`}
                style={{ backgroundImage: `url(${image.thumbnail_url})` }}
                onClick={() => handleBackgroundChange(image.original_image_url, image.photographer)}
              >
              </Card>
            ))}
          </div>

          <div className="mt-auto">
            <div className="border-t border-[#d9d9d9] my-8"></div>

            <div className="flex items-center gap-8">
              <label className="text-[#1b1b1b] font-medium whitespace-nowrap">Frequency</label>
              <div className="relative w-48">
                <button 
                  className="w-full flex items-center justify-between bg-white border border-[#d9d9d9] rounded px-4 py-2 text-[#1b1b1b]"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span>{selectedFrequency}</span>
                  <ChevronDown className="h-5 w-5 text-[#858585]" />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute bottom-full left-0 w-full mb-1 bg-white border border-[#d9d9d9] rounded shadow-lg z-10">
                    <div 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedFrequency("Permanent")
                        setDropdownOpen(false)
                      }}
                    >
                      Permanent
                    </div>
                    <div 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedFrequency("Hourly")
                        setDropdownOpen(false)
                      }}
                    >
                      Hourly
                    </div>
                    <div 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedFrequency("Daily")
                        setDropdownOpen(false)
                      }}
                    >
                      Daily
                    </div>
                  </div>
                )}
              </div>

              <label className="text-[#1b1b1b] font-medium ml-4 whitespace-nowrap">Blur</label>
              <Slider
                className="w-48"
                defaultValue={[25]}
                max={100}
                step={1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}