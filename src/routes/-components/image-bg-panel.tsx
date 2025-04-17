import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
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
  const { data, isLoading, error } = useImageFetch()

  const handleBackgroundChange = (backgroundUrl: string, photographer: string = "") => {
    setSelectedBackground(backgroundUrl)
    setCurrentBackground(backgroundUrl)
    setCurrentPhotographer(photographer)
  }

  const handleSolidColorsClick = () => {
    setShowBackgrounds(true)
    setCurrentPhotographer("") // Clear photographer when switching to solid colors
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
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">
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
            {/* Solid Colors Card */}
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

            {/* Image Cards */}
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
        </div>
      </div>
    </div>
  )
}