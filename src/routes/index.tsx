import { Camera, CirclePlay, Clock4, Image, Menu, Pause, Play, Settings } from "lucide-react"
import { listenForSettingsChanges, loadSettings, saveSettings } from "@/utils/chrome-storage"
import { useEffect, useState } from "react"

import Clock from "./-components/clock"
import ImageBackgroundPanel from "./-components/image-bg-panel"
import ListenPanel from "./-components/listen-panel"
import PlayerService from "@/services/PlayerService"
import Quote from "./-components/quote"
import SettingsPanel from "./-components/settings-panel"
import { createFileRoute } from '@tanstack/react-router'
import { useTheme } from "./-components/theme-provider" // Import the theme hook

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  // Theme integration
  const { theme } = useTheme(); // Get the current theme from ThemeProvider
  
  // State declarations
  const [showSettings, setShowSettings] = useState(false)
  const [showListenPanel, setShowListenPanel] = useState(false)
  const [showImageBackgrounds, setShowImageBackgrounds] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [darkMode, setDarkMode] = useState(false)
  const [currentBackground, setCurrentBackground] = useState("#000000")
  const [currentPhotographer, setCurrentPhotographer] = useState("")
  const [pageUrl, setPageUrl] = useState("") // Add this new state
  const [timeAndDateVisible, setTimeAndDateVisible] = useState(true)
  const [quotesVisible, setQuotesVisible] = useState(true)
  const [timeFormat, setTimeFormat] = useState("12h")
  const [dateFormat, setDateFormat] = useState("default")
  const [language, setLanguage] = useState("en")
  const [quoteFrequency, setQuoteFrequency] = useState("daily")
  const [backgroundKey, setBackgroundKey] = useState(0)
  const [blurAmount, setBlurAmount] = useState(0)
  const [settingsLoaded, setSettingsLoaded] = useState(false)

  const player = PlayerService;
  const [isPlaying, setIsPlaying] = useState(player.isPlaying()); // Local state for playback

  useEffect(() => {
    const unsubscribe = player.subscribeToPlayback(setIsPlaying); // Subscribe to playback state changes
    return unsubscribe; // Cleanup on unmount
  }, [player]);

  // Sync darkMode state with the theme from ThemeProvider
  useEffect(() => {
    const isDark = theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
  }, [theme]);

  // Listen for system theme changes when using system preference
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Load settings when component mounts
  useEffect(() => {
    const loadAppSettings = async () => {
      try {
        const settings = await loadSettings();
        
        // Don't set darkMode here, it's controlled by the theme provider
        setTimeFormat(settings.timeFormat);
        setDateFormat(settings.dateFormat);
        setLanguage(settings.language);
        setQuoteFrequency(settings.quoteFrequency);
        setTimeAndDateVisible(settings.timeAndDateVisible);
        setQuotesVisible(settings.quotesVisible);
        setCurrentBackground(settings.currentBackground);
        setCurrentPhotographer(settings.currentPhotographer);
        setPageUrl(settings.pageUrl || ""); // Add this line
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
      // Note: darkMode handling is done via the theme provider
      if ('timeFormat' in changedSettings && changedSettings.timeFormat !== undefined) setTimeFormat(changedSettings.timeFormat);
      if ('dateFormat' in changedSettings && changedSettings.dateFormat !== undefined) setDateFormat(changedSettings.dateFormat);
      if ('language' in changedSettings && changedSettings.language !== undefined) setLanguage(changedSettings.language);
      if ('quoteFrequency' in changedSettings && changedSettings.quoteFrequency !== undefined) setQuoteFrequency(changedSettings.quoteFrequency);
      if ('timeAndDateVisible' in changedSettings && changedSettings.timeAndDateVisible !== undefined) setTimeAndDateVisible(changedSettings.timeAndDateVisible);
      if ('quotesVisible' in changedSettings && changedSettings.quotesVisible !== undefined) setQuotesVisible(changedSettings.quotesVisible);
      if ('currentBackground' in changedSettings && changedSettings.currentBackground !== undefined) setCurrentBackground(changedSettings.currentBackground);
      if ('currentPhotographer' in changedSettings && changedSettings.currentPhotographer !== undefined) setCurrentPhotographer(changedSettings.currentPhotographer);
      if ('pageUrl' in changedSettings && changedSettings.pageUrl !== undefined) setPageUrl(typeof changedSettings.pageUrl === 'string' ? changedSettings.pageUrl : "");
      if ('blurAmount' in changedSettings && changedSettings.blurAmount !== undefined) setBlurAmount(changedSettings.blurAmount);
    });

    return unsubscribe;
  }, []);

  // Save settings whenever relevant state changes
  useEffect(() => {
    if (!settingsLoaded) return; // Don't save until initial load is complete

    saveSettings({
      darkMode, // We still save darkMode to sync with other components
      timeFormat,
      dateFormat,
      language,
      quoteFrequency,
      timeAndDateVisible,
      quotesVisible,
      currentBackground,
      currentPhotographer,
      pageUrl, // Add this line
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
    pageUrl, // Add this to the dependency array
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

  // Style for the content container - use darkMode state that's synced with theme
  const contentStyles = {
    position: 'relative' as const,
    zIndex: 1, // Place content above background
    height: '100%',
    width: '100%',
    color: 'white', // Always use white text for better visibility on backgrounds
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
    <div className={`flex h-screen w-screen overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Add the dark class to the root div based on darkMode state */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-0"
          onClick={handleMainAreaClick}>
        {/* Separate background div with blur effect - using key only for this element */}
        <div 
          key={backgroundKey}
          style={backgroundStyles}
        ></div>
        
        {/* Content container above the background - NOT affected by backgroundKey */}
        <div style={contentStyles} className="flex flex-col items-center justify-center w-full h-full">
          {/* Fixed shadow overlay that covers the entire bottom - with very low z-index */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 to-transparent pointer-events-none w-full" 
               style={{position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5}}></div>
          
          {timeAndDateVisible && (
            <div className="mb-16"> {/* Added wrapper with margin-bottom to move the clock higher */}
              <Clock 
                currentTime={currentTime} 
                timeFormat={timeFormat}
                dateFormat={dateFormat}
              />
            </div>
          )}
          
          {quotesVisible && (
            <div className="absolute bottom-1/6 left-0 right-0 flex justify-center">
              {/* Use a stable key for Quote that doesn't change with background */}
              <Quote key="stable-quote-component" />
            </div>
          )}
          
          {/* Photographer credit with higher z-index */}
          {isImageUrl && currentPhotographer && (
            <div 
              className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full z-20 cursor-pointer hover:bg-black/50 transition-colors"
              onClick={() => pageUrl ? window.open(pageUrl, '_blank') : null}
              title="Visit photographer page"
            >
              <Camera className="w-5 h-5 text-white" />
              <span className="text-white text-sm">
                {currentPhotographer}
              </span>
            </div>
          )}
          
          {/* Button container with higher z-index */}
          <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
            <button 
              className="p-2 rounded-full bg-transparent hover:bg-white/20" 
              onClick={() => {
                if (isPlaying) {
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
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </button>
            <button 
              className="p-2 rounded-full bg-transparent hover:bg-white/20" 
              onClick={handleListenClick}
            >
              <Clock4 className="w-6 h-6 text-white" />
            </button>
            <button 
              className="p-2 rounded-full bg-transparent hover:bg-white/20" 
              onClick={handleListenClick}
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
          pageUrl={pageUrl} 
          setPageUrl={setPageUrl}
          blurAmount={blurAmount}
          setBlurAmount={setBlurAmount}
        />
      )}

      {(showSettings || showListenPanel || showImageBackgrounds) && (
        <div className="flex flex-col items-center py-4 bg-background border-l border-input w-16 h-screen relative">
          {/* Vertical separator that runs along the height of the sidebar */}
          <div className="absolute top-0 left-0 w-px h-full bg-border shadow-sm z-10"></div>
          
          <img 
            src="/icons/web/Icon_48.png" 
            alt="Icon" 
            className="w-8 h-8 mb-4" 
          />
          <button 
            className={`p-2 rounded-full ${showListenPanel ? 'bg-accent' : 'hover:bg-accent/50'} mb-4`}
            onClick={handleListenClick}
          >
            <CirclePlay className="w-6 h-6 text-foreground" />
          </button>
          <button 
            className={`p-2 rounded-full ${showImageBackgrounds ? 'bg-accent' : 'hover:bg-accent/50'} mb-4`}
            onClick={handleImageBackgroundsClick}
          >
            <Image className="w-6 h-6 text-foreground" />
          </button>
          <div className="flex-grow" />
          <button 
            className={`p-2 rounded-full ${showSettings ? 'bg-accent' : 'hover:bg-accent/50'}`} 
            onClick={handleSettingsClick}
          >
            <Settings className="w-6 h-6 text-foreground" />
          </button>
        </div>
      )}
    </div>
  )
}