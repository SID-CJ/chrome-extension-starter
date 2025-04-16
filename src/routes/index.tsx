import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from "react"
import { Settings, CirclePlay, Menu, Image, Play, Pause } from "lucide-react"
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
  const [timeAndDateVisible, setTimeAndDateVisible] = useState(true)
  const [quotesVisible, setQuotesVisible] = useState(true)
  const [timeFormat, setTimeFormat] = useState("12h")
  const [dateFormat, setDateFormat] = useState("mdy")
  const [backgroundKey, setBackgroundKey] = useState(0)

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
        backgroundSize: 'cover', // Explicitly set to 'cover'
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: darkMode ? 'inherit' : 'white',
        height: '100vh', // Ensure full viewport height
        width: '100vw', // Ensure full viewport width
      }
    : {
        background: currentBackground,
        backgroundSize: 'cover',
        color: darkMode ? 'inherit' : 'white',
        height: '100vh', // Ensure full viewport height
        width: '100vw', // Ensure full viewport width
      }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div
        key={backgroundKey}
        className="flex-1 flex flex-col items-center justify-center relative p-2"
        style={backgroundStyles}
      >
        {timeAndDateVisible && (
          <Clock 
            currentTime={currentTime} 
            timeFormat={timeFormat}
            dateFormat={dateFormat}
          />
        )}
        
        {quotesVisible && <Quote />}
        
        <div className="absolute bottom-4 left-4 flex space-x-2">
          <button 
            className="p-2 rounded-full bg-white/10 hover:bg-white/20" 
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
            className="p-2 rounded-full bg-white/10 hover:bg-white/20" 
            onClick={handleImageBackgroundsClick}
          >
            <Image className="w-6 h-6 text-white" />
          </button>
          <button 
            className="p-2 rounded-full bg-white/10 hover:bg-white/20" 
            onClick={handleSettingsClick}
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
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