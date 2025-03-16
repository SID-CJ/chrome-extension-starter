import { Switch } from "@/components/ui/switch"

interface SettingsPanelProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  timeAndDateVisible: boolean
  setTimeAndDateVisible: (value: boolean) => void
  quotesVisible: boolean
  setQuotesVisible: (value: boolean) => void
}

export default function SettingsPanel({ 
  darkMode, 
  setDarkMode, 
  timeAndDateVisible, 
  setTimeAndDateVisible, 
  quotesVisible, 
  setQuotesVisible 
}: SettingsPanelProps) {
  return (
    <div className="w-120 bg-white p-6 overflow-y-auto h-full shadow-lg border-r border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-[#1e1e1e]">Settings</h2>
      <div className="border-b border-[#d9d9d9] mb-4"></div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-[#1e1e1e]">Time and date</span>
          <Switch
            checked={timeAndDateVisible}
            onCheckedChange={setTimeAndDateVisible}
            className="data-[state=checked]:bg-[#65d46e]"
          />
        </div>
        <div className="pl-4 text-[#858585]">
          <div className="mb-3">Time format</div>
          <div className="mb-6">Date format</div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#1e1e1e]">Quotes</span>
          <Switch 
            checked={quotesVisible} 
            onCheckedChange={setQuotesVisible} 
            className="data-[state=checked]:bg-[#65d46e]" 
          />
        </div>
        <div className="pl-4 text-[#858585]">
          <div className="mb-3">Frequency</div>
          <div className="mb-6">Date format</div>
        </div>
        <div className="border-b border-[#d9d9d9] mb-4"></div>
        <h3 className="text-[#1e1e1e] font-medium">General settings</h3>
        <div className="pl-4 text-[#858585]">
          <div className="mb-3">Language</div>
          <div className="mb-3 flex items-center justify-between">
            <span>Dark mode</span>
            <Switch 
              checked={darkMode} 
              onCheckedChange={setDarkMode} 
              className="data-[state=checked]:bg-[#65d46e]" 
            />
          </div>
        </div>
      </div>
    </div>
  )
}