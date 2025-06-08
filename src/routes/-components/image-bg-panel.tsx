import { ChevronDown } from "lucide-react"
//import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { useState, useEffect } from "react"
import { useImageFetch } from "@/api/image/useImageFetch"
import ColorPalette from "./background-panel"

interface ImageBackgroundPanelProps {
  currentBackground: string
  setCurrentBackground: (background: string) => void
  setShowImageBackgrounds: (show: boolean) => void
  currentPhotographer: string
  setCurrentPhotographer: (photographer: string) => void
  pageUrl?: string
  setPageUrl?: (url: string) => void
  blurAmount?: number
  setBlurAmount?: (amount: number) => void
}

export default function ImageBackgroundPanel({
  currentBackground,
  setCurrentBackground,
  setShowImageBackgrounds,
  setCurrentPhotographer,
  setPageUrl = () => {},
  blurAmount = 0,
  setBlurAmount = () => {},
}: ImageBackgroundPanelProps) {
  
  const [selectedBackground, setSelectedBackground] = useState(currentBackground)
  const [showBackgrounds, setShowBackgrounds] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedFrequency, setSelectedFrequency] = useState("Select an option")
  const [currentSolidColor, setCurrentSolidColor] = useState("black") // Add this state
  const { data, isLoading, error } = useImageFetch()

  // Local blur state to track slider value
  const [blur, setBlur] = useState(blurAmount)

  const handleBackgroundChange = (backgroundUrl: string, photographer: string = "", photoUrl: string = "") => {
    setSelectedBackground(backgroundUrl)
    setCurrentBackground(backgroundUrl)
    setCurrentPhotographer(photographer)
    setPageUrl(photoUrl)
  }

  // Handler for blur slider changes
  const handleBlurChange = (values: number[]) => {
    const newBlurValue = values[0]
    setBlur(newBlurValue)
    setBlurAmount(newBlurValue)
  }

  const handleSolidColorsClick = () => {
    setShowBackgrounds(true)
    setCurrentPhotographer("")
  }

  // Extract color value from background string if it's a CSS color
  useEffect(() => {
    if (currentBackground.startsWith('#') || 
        currentBackground.startsWith('rgb') ||
        currentBackground.startsWith('hsl')) {
      setCurrentSolidColor(currentBackground);
    }
  }, [currentBackground]);

  if (showBackgrounds) {
    return (
      <ColorPalette
        currentBackground={currentBackground}
        setCurrentBackground={setCurrentBackground}
        setShowBackgrounds={setShowBackgrounds}
        setShowImageBackgrounds={setShowImageBackgrounds}
        currentSolidColor={currentSolidColor}
        setCurrentSolidColor={setCurrentSolidColor}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="w-150 flex h-screen bg-background text-foreground">
        <div className="flex-1 overflow-auto flex flex-col">
          <div className="p-4 md:p-6 flex flex-col h-full">
            <div className="flex flex-col mb-4">
              <h1 className="text-3xl font-bold mb-2">Background Images</h1>
              <p className="text-sm text-muted-foreground">We'll update images based on time and chosen frequency</p>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Card
                className="aspect-square border-2 cursor-pointer rounded-none max-w-[180px]"
                style={{ backgroundColor: currentSolidColor }}
                onClick={handleSolidColorsClick}
              >
                <div className="h-full w-full flex items-center justify-center p-2">
                  <span className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                    Solid Colors
                  </span>
                </div>
              </Card>
              
              <div className="col-span-2 flex items-center">
                <p>Loading images...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-150 flex h-screen bg-background text-foreground">
        <div className="flex-1 overflow-auto flex flex-col">
          <div className="p-4 md:p-6 flex flex-col h-full">
            <div className="flex flex-col mb-4">
              <h1 className="text-3xl font-bold mb-2">Background Images</h1>
              <p className="text-sm text-muted-foreground">We'll update images based on time and chosen frequency</p>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Card
                className="aspect-square border-2 cursor-pointer rounded-none max-w-[180px]"
                style={{ backgroundColor: currentSolidColor }}
                onClick={handleSolidColorsClick}
              >
                <div className="h-full w-full flex items-center justify-center p-2">
                  <span className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                    Solid Colors
                  </span>
                </div>
              </Card>
              
              <div className="col-span-2 flex items-center">
                <p>Error loading images: {error.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-150 flex h-screen bg-background text-foreground">
      <div className="flex-1 overflow-auto flex flex-col">
        <div className="p-4 md:p-6 flex flex-col h-full">
          <div className="flex flex-col mb-4">
            <h1 className="text-3xl font-bold mb-2">Background Images</h1>
            <p className="text-sm text-muted-foreground">We'll update images based on time and chosen frequency</p>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Card
              className="aspect-square border-2 cursor-pointer rounded-none max-w-[180px]"
              style={{ backgroundColor: currentSolidColor }}
              onClick={handleSolidColorsClick}
            >
              <div className="h-full w-full flex items-center justify-center p-2">
                <span className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                  Solid Colors
                </span>
              </div>
            </Card>

            {data?.images.map((image) => (
              <Card
                key={image.id}
                className={`aspect-square border-2 cursor-pointer bg-cover bg-center rounded-none max-w-[180px] ${
                  selectedBackground === image.original_image_url ? "border-blue-500" : "border-[#d9d9d9] dark:border-gray-700"
                }`}
                style={{ 
                  backgroundImage: `url(${image.thumbnail_url})` // Use original URL directly
                }}
                onClick={() => handleBackgroundChange(image.original_image_url, image.photographer, image.page_url)}
              />
            ))}
          </div>

          <div className="mt-auto">
            <div className="border-t border-muted my-8"></div>

            <div className="flex items-center gap-8">
              <label className="font-medium whitespace-nowrap">Frequency</label>
              <div className="relative w-48">
                <button 
                  className="w-full flex items-center justify-between bg-card text-card-foreground border border-input rounded px-4 py-2"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span>{selectedFrequency}</span>
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute bottom-full left-0 w-full mb-1 bg-card text-card-foreground border border-input rounded shadow-lg z-10">
                    <div 
                      className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      onClick={() => {
                        setSelectedFrequency("Permanent")
                        setDropdownOpen(false)
                      }}
                    >
                      Permanent
                    </div>
                    <div 
                      className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      onClick={() => {
                        setSelectedFrequency("Hourly")
                        setDropdownOpen(false)
                      }}
                    >
                      Hourly
                    </div>
                    <div 
                      className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
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

              <label className="font-medium ml-4 whitespace-nowrap">Blur</label>
              <Slider
                className="w-48"
                defaultValue={[blur]}
                value={[blur]}
                max={20}
                step={1}
                onValueChange={handleBlurChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}