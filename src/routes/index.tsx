import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from "react"
import { Settings, CirclePlay, Menu, Image, Play, Pause, Clock4, Camera } from "lucide-react"
import SettingsPanel from "./-components/settings-panel"
import ListenPanel from "./-components/listen-panel"
import ImageBackgroundPanel from "./-components/image-bg-panel"
import Clock from "./-components/clock"
import Quote from "./-components/quote"
import PlayerService from "@/services/PlayerService";

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [showSettings, setShowSettings] = useState(false)
  const [showListenPanel, setShowListenPanel] = useState(false)
  const [showImageBackgrounds, setShowImageBackgrounds] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [darkMode, setDarkMode] = useState(false)
  const [currentBackground, setCurrentBackground] = useState(" #4a3b78")
  const [currentPhotographer, setCurrentPhotographer] = useState("")
  const [timeAndDateVisible, setTimeAndDateVisible] = useState(true)
  const [quotesVisible, setQuotesVisible] = useState(true)
  const [timeFormat, setTimeFormat] = useState("12h")
  const [dateFormat, setDateFormat] = useState("mdy")
  const [backgroundKey, setBackgroundKey] = useState(0)
  const [blurAmount, setBlurAmount] = useState(0) // Add blur amount state

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Check if we're changing to an image URL
    const isImageUrl = currentBackground.startsWith('http') || currentBackground.startsWith('https')
    
    if (isImageUrl) {
      // Force re-render of the background container by updating the key
      setBackgroundKey(prevKey => prevKey + 1)
    }
  }, [currentBackground])

  const handleSettingsClick = () => {
    setShowSettings(prev => !prev)
    setShowListenPanel(false)
    setShowImageBackgrounds(false)
  }

  const handleListenClick = () => {
    setShowListenPanel(prev => !prev)
    setShowSettings(false)
    setShowImageBackgrounds(false)
  }

  const handleImageBackgroundsClick = () => {
    setShowImageBackgrounds(prev => !prev)
    setShowSettings(false)
    setShowListenPanel(false)
  }

  const player = PlayerService;

  // Determine if currentBackground is an image URL or a gradient
  const isImageUrl = currentBackground.startsWith('http') || currentBackground.startsWith('https')
  const backgroundStyles = isImageUrl
    ? {
        backgroundImage: `url(${currentBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none', // Apply blur only to background
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0, // Place it behind all content
      }
    : {
        background: currentBackground,
        backgroundSize: 'cover',
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0, // Place it behind all content
      }

  // Style for the content container
  const contentStyles = {
    position: 'relative' as const,
    zIndex: 1, // Place content above background
    height: '100%',
    width: '100%',
    color: darkMode ? 'inherit' : 'white',
  }

  const handleMainAreaClick = () => {
    if (showSettings || showListenPanel || showImageBackgrounds) {
      setShowSettings(false);
      setShowListenPanel(false);
      setShowImageBackgrounds(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div
        key={backgroundKey}
        className="flex-1 flex flex-col items-center justify-center relative p-0" // Changed p-2 to p-0
        onClick={handleMainAreaClick}
      >
        {/* Separate background div with blur effect */}
        <div style={backgroundStyles}></div>
        
        {/* Content container above the background */}
        <div style={contentStyles} className="flex flex-col items-center justify-center w-full h-full">
          {/* Fixed shadow overlay that covers the entire bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none w-full" 
               style={{position: 'absolute', bottom: 0, left: 0, right: 0}}></div>
          
          {timeAndDateVisible && (
            <Clock 
              currentTime={currentTime} 
              timeFormat={timeFormat}
              dateFormat={dateFormat}
            />
          )}
          
          {quotesVisible && (
            <div className="absolute bottom-1/6 left-0 right-0 flex justify-center">
              <Quote />
            </div>
          )}
          
          {/* Add photographer credit at bottom left */}
          {isImageUrl && currentPhotographer && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full z-10">
              <Camera className="w-5 h-5 text-white" />
              <span className="text-white text-sm">
                {currentPhotographer}
              </span>
            </div>
          )}
          
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button 
              className="p-2 rounded-full bg-0 hover:bg-white/20" 
              onClick={() => {
                if (player.isPlaying()) {
                  player.pause();
                } else {
                  if (!player.getCurrentTrackId()) {
                    // If no track is loaded, open the panel to select one
                    handleListenClick();
                  } else {
                    player.play();
                  }
                }
              }}
            >
              {player.isPlaying() ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </button>
            <button 
              className="p-2 rounded-full bg-0 hover:bg-white/20" 
              onClick={handleListenClick}
            >
              <Clock4 className="w-6 h-6 text-white" />
            </button>
            <button 
              className="p-2 rounded-full bg-0 hover:bg-white/20" 
              onClick={handleSettingsClick}
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {showSettings && (
        <SettingsPanel 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
          timeAndDateVisible={timeAndDateVisible}
          setTimeAndDateVisible={setTimeAndDateVisible}
          quotesVisible={quotesVisible}
          setQuotesVisible={setQuotesVisible}
          timeFormat={timeFormat}
          setTimeFormat={setTimeFormat}
          dateFormat={dateFormat}
          setDateFormat={setDateFormat}
        />
      )}

      {showListenPanel && <ListenPanel />}

      {showImageBackgrounds && (
        <ImageBackgroundPanel 
          currentBackground={currentBackground} 
          setCurrentBackground={setCurrentBackground}
          setShowImageBackgrounds={setShowImageBackgrounds}
          currentPhotographer={currentPhotographer}
          setCurrentPhotographer={setCurrentPhotographer}
          blurAmount={blurAmount}
          setBlurAmount={setBlurAmount}
        />
      )}

      {(showSettings || showListenPanel || showImageBackgrounds) && (
        <div className="flex flex-col items-center py-4 bg-white w-16 h-screen">
          <img 
            src="/icons/web/Icon_48.png" 
            alt="Icon" 
            className="w-8 h-8 mb-4" 
          />
          <button 
            className={`p-2 rounded-full ${showListenPanel ? 'bg-[#cdcdcd]' : 'hover:bg-[#cdcdcd]'} mb-4`}
            onClick={handleListenClick}
          >
            <CirclePlay className="w-6 h-6 text-[#1e1e1e]" />
          </button>
          <button 
            className={`p-2 rounded-full ${showImageBackgrounds ? 'bg-[#cdcdcd]' : 'hover:bg-[#cdcdcd]'} mb-4`}
            onClick={handleImageBackgroundsClick}
          >
            <Image className="w-6 h-6 text-[#1e1e1e]" />
          </button>
          <div className="flex-grow" />
          <button 
            className={`p-2 rounded-full ${showSettings ? 'bg-[#cdcdcd]' : 'hover:bg-[#cdcdcd]'}`} 
            onClick={handleSettingsClick}
          >
            <Settings className="w-6 h-6 text-[#1e1e1e]" />
          </button>
        </div>
      )}
    </div>
  )
}