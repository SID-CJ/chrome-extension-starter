import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from "react"
import { Settings, Image, Music } from "lucide-react"
import SettingsPanel from "./-components/settings-panel"
import BackgroundPanel from "./-components/background-panel"
import ListenPanel from "./-components/listen-panel"
import Clock from "./-components/clock"
import Quote from "./-components/quote"

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    const [showSettings, setShowSettings] = useState(false)
    const [showBackgrounds, setShowBackgrounds] = useState(false)
    const [showListenPanel, setShowListenPanel] = useState(false)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [darkMode, setDarkMode] = useState(false)
    const [currentBackground, setCurrentBackground] = useState("linear-gradient(to bottom right, #4a3b78, #8a56a0)")
    const [timeAndDateVisible, setTimeAndDateVisible] = useState(true)
    const [quotesVisible, setQuotesVisible] = useState(true)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const handleSettingsClick = () => {
        setShowSettings(true)
        setShowBackgrounds(false)
        setShowListenPanel(false)
    }

    const handleBackgroundsClick = () => {
        setShowBackgrounds(true)
        setShowSettings(false)
        setShowListenPanel(false)
    }

    const handleListenClick = () => {
        setShowListenPanel(true)
        setShowSettings(false)
        setShowBackgrounds(false)
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            {/* Sidebar */}
            <div className="flex flex-col items-center py-4 bg-[#d9d9d9] w-16">
                <button 
                    className={`p-2 rounded-full ${showSettings ? 'bg-[#cdcdcd]' : 'hover:bg-[#cdcdcd]'} mb-4`} 
                    onClick={handleSettingsClick}
                >
                    <Settings className="w-6 h-6 text-[#1e1e1e]" />
                </button>
                <button 
                    className={`p-2 rounded-full ${showBackgrounds ? 'bg-[#cdcdcd]' : 'hover:bg-[#cdcdcd]'} mb-4`}
                    onClick={handleBackgroundsClick}
                >
                    <Image className="w-6 h-6 text-[#1e1e1e]" />
                </button>
                <button 
                    className={`p-2 rounded-full ${showListenPanel ? 'bg-[#cdcdcd]' : 'hover:bg-[#cdcdcd]'} mb-4`}
                    onClick={handleListenClick}
                >
                    <Music className="w-6 h-6 text-[#1e1e1e]" />
                </button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <SettingsPanel 
                    darkMode={darkMode} 
                    setDarkMode={setDarkMode}
                    timeAndDateVisible={timeAndDateVisible}
                    setTimeAndDateVisible={setTimeAndDateVisible}
                    quotesVisible={quotesVisible}
                    setQuotesVisible={setQuotesVisible}
                />
            )}
            
            {/* Background Panel */}
            {showBackgrounds && (
                <BackgroundPanel 
                    currentBackground={currentBackground} 
                    setCurrentBackground={setCurrentBackground} 
                />
            )}

            {/* Listen Panel */}
            {showListenPanel && <ListenPanel />}

            {/* Main Content */}
            <div
                className="flex-1 flex flex-col items-center justify-center relative p-2"
                style={{
                    background: currentBackground,
                    backgroundSize: "cover",
                    color: darkMode ? "inherit" : "white"
                }}
            >
                <h3>Welcome Home!</h3>
                
                {/* Only render Clock if timeAndDateVisible is true */}
                {timeAndDateVisible && <Clock currentTime={currentTime} />}
                
                {/* Only render Quote if quotesVisible is true */}
                {quotesVisible && <Quote />}
                
                {/* Bottom right buttons */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                    <button className="p-2 rounded-full bg-white/10 hover:bg-white/20" onClick={handleListenClick}>
                        <Music className="w-6 h-6 text-white" />
                    </button>
                    <button className="p-2 rounded-full bg-white/10 hover:bg-white/20" onClick={handleBackgroundsClick}>
                        <Image className="w-6 h-6 text-white" />
                    </button>
                    <button className="p-2 rounded-full bg-white/10 hover:bg-white/20" onClick={handleSettingsClick}>
                        <Settings className="w-6 h-6 text-white" />
                    </button>
                </div>
            </div>
        </div>
    )
}