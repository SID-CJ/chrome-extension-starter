import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from "react"
import { Settings, CirclePlay, Menu, Image, Play, Pause, Clock4, Camera } from "lucide-react"
import SettingsPanel from "./-components/settings-panel"
import ListenPanel from "./-components/listen-panel"
import ImageBackgroundPanel from "./-components/image-bg-panel"
import Clock from "./-components/clock"
import Quote from "./-components/quote"
import PlayerService from "@/services/PlayerService"
import { loadSettings, saveSettings, listenForSettingsChanges } from "@/utils/chrome-storage"

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  // State declarations
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
  const [language, setLanguage] = useState("en")
  const [quoteFrequency, setQuoteFrequency] = useState("daily")
  const [backgroundKey, setBackgroundKey] = useState(0)
  const [blurAmount, setBlurAmount] = useState(0)
  const [settingsLoaded, setSettingsLoaded] = useState(false)

  // Load settings when component mounts
  useEffect(() => {
    const loadAppSettings = async () => {
      try {
        const settings = await loadSettings();
        
        setDarkMode(settings.darkMode);
        setTimeFormat(settings.timeFormat);
        setDateFormat(settings.dateFormat);
        setLanguage(settings.language);
        setQuoteFrequency(settings.quoteFrequency);
        setTimeAndDateVisible(settings.timeAndDateVisible);
        setQuotesVisible(settings.quotesVisible);
        setCurrentBackground(settings.currentBackground);
        setCurrentPhotographer(settings.currentPhotographer);
        setBlurAmount(settings.blurAmount);
        
        setSettingsLoaded(true);
      } catch (error) {
        console.error('Error loading settings:', error);
        setSettingsLoaded(true); // Mark as loaded even on error
      }
    };

    loadAppSettings();
  }, []);

  // Listen for settings changes from other tabs/windows
  useEffect(() => {
    const unsubscribe = listenForSettingsChanges((changedSettings) => {
      // Update state for any changed settings
      if ('darkMode' in changedSettings && changedSettings.darkMode !== undefined) setDarkMode(changedSettings.darkMode);
      if ('timeFormat' in changedSettings && changedSettings.timeFormat !== undefined) setTimeFormat(changedSettings.timeFormat);
      if ('dateFormat' in changedSettings && changedSettings.dateFormat !== undefined) setDateFormat(changedSettings.dateFormat);
      if ('language' in changedSettings && changedSettings.language !== undefined) setLanguage(changedSettings.language);
      if ('quoteFrequency' in changedSettings && changedSettings.quoteFrequency !== undefined) setQuoteFrequency(changedSettings.quoteFrequency);
      if ('timeAndDateVisible' in changedSettings && changedSettings.timeAndDateVisible !== undefined) setTimeAndDateVisible(changedSettings.timeAndDateVisible);
      if ('quotesVisible' in changedSettings && changedSettings.quotesVisible !== undefined) setQuotesVisible(changedSettings.quotesVisible);
      if ('currentBackground' in changedSettings && changedSettings.currentBackground !== undefined) setCurrentBackground(changedSettings.currentBackground);
      if ('currentPhotographer' in changedSettings && changedSettings.currentPhotographer !== undefined) setCurrentPhotographer(changedSettings.currentPhotographer);
      if ('blurAmount' in changedSettings && changedSettings.blurAmount !== undefined) setBlurAmount(changedSettings.blurAmount);
    });

    return unsubscribe;
  }, []);

  // Save settings whenever relevant state changes
  useEffect(() => {
    if (!settingsLoaded) return; // Don't save until initial load is complete

    saveSettings({
      darkMode,
      timeFormat,
      dateFormat,
      language,
      quoteFrequency,
      timeAndDateVisible,
      quotesVisible,
      currentBackground,
      currentPhotographer,
      blurAmount,
    });
  }, [
    darkMode, 
    timeFormat, 
    dateFormat, 
    language, 
    quoteFrequency, 
    timeAndDateVisible, 
    quotesVisible, 
    currentBackground,
    currentPhotographer,
    blurAmount,
    settingsLoaded
  ]);

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

  const updateQuoteFrequency = (frequency: string) => {
    // Validate that the frequency is one of our accepted values
    if (['hourly', 'daily', 'weekly'].includes(frequency)) {
      localStorage.setItem('quoteFrequency', frequency);
      
      // Force a new fetch when changing frequency
      localStorage.removeItem('lastQuoteFetchTime');
      setQuoteFrequency(frequency);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center relative p-0"
          onClick={handleMainAreaClick}>
        {/* Separate background div with blur effect - using key only for this element */}
        <div 
          key={backgroundKey}
          style={backgroundStyles}
        ></div>
        
        {/* Content container above the background - NOT affected by backgroundKey */}
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
              {/* Use a stable key for Quote that doesn't change with background */}
              <Quote key="stable-quote-component" />
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
          language={language}
          setLanguage={setLanguage}
          quoteFrequency={quoteFrequency}
          setQuoteFrequency={updateQuoteFrequency}
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