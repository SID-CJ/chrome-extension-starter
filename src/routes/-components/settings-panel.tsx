"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "../-components/theme-provider"; // Import the useTheme hook

interface SettingsPanelProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  timeAndDateVisible: boolean;
  setTimeAndDateVisible: (value: boolean) => void;
  quotesVisible: boolean;
  setQuotesVisible: (value: boolean) => void;
  timeFormat: string;
  setTimeFormat: (value: string) => void;
  dateFormat: string;
  setDateFormat: (value: string) => void;
}

export default function SettingsPanel({
  setDarkMode,
  timeAndDateVisible,
  setTimeAndDateVisible,
  quotesVisible,
  setQuotesVisible,
  timeFormat,
  setTimeFormat,
  dateFormat,
  setDateFormat,
}: SettingsPanelProps) {
  const { theme, setTheme } = useTheme(); // Use theme and setTheme from ThemeProvider
  const [quoteFrequency, setQuoteFrequency] = useState("daily");
  const [language, setLanguage] = useState("en");
  const [darkModeOption, setDarkModeOption] = useState<'dark' | 'light' | 'system'>(theme as 'dark' | 'light' | 'system'); // Sync with theme provider

  const handleDarkModeChange = (value: 'dark' | 'light' | 'system') => {
    setDarkModeOption(value);
    if (value === "dark") {
      setTheme("dark"); // Update theme via ThemeProvider
      setDarkMode(true); // Sync parent state
    } else if (value === "light") {
      setTheme("light");
      setDarkMode(false);
    } else {
      setTheme("system");
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches); // Sync with system preference
    }
  };

  return (
    <div className="w-150 bg-white p-6 overflow-y-auto h-full shadow-lg border-r border-gray-200 relative">
      <h2 className="text-2xl font-bold mb-6 text-[#1e1e1e]">Settings</h2>
      <Separator className="mb-6 border-[#d9d9d9]" />

      <Card className="bg-[#000000] text-white mb-8">
        <CardContent className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <p className="text-xl mb-4">
            Get a <span className="font-bold">Life-Time</span> account for just{" "}
            <span className="font-bold">$10/-</span>
          </p>
          <Button
            variant="outline"
            className="border-white text-black dark:text-white hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors w-48 mb-4"
          >
            Get it now
          </Button>
          <p className="text-sm opacity-80">open to a limited number of users</p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium text-[#1e1e1e]">Time and date</h3>
          <Switch
            checked={timeAndDateVisible}
            onCheckedChange={setTimeAndDateVisible}
            className="data-[state=checked]:bg-[#65d46e]"
          />
        </div>
        <Separator className="border-[#d9d9d9]" />

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <label className="text-base text-[#858585]">Time format</label>
          </div>
          <div className="col-span-2">
            <Select value={timeFormat} onValueChange={setTimeFormat}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12-hour</SelectItem>
                <SelectItem value="24h">24-hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <label className="text-base text-[#858585]">Date format</label>
          </div>
          <div className="col-span-2">
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="def">default</SelectItem>
                <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <h3 className="text-xl font-medium text-[#1e1e1e]">Quotes</h3>
          <Switch
            checked={quotesVisible}
            onCheckedChange={setQuotesVisible}
            className="data-[state=checked]:bg-[#65d46e]"
          />
        </div>
        <Separator className="border-[#d9d9d9]" />

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <label className="text-base text-[#858585]">Frequency</label>
          </div>
          <div className="col-span-2">
            <Select value={quoteFrequency} onValueChange={setQuoteFrequency}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-xl font-medium text-[#1e1e1e]">General settings</h3>
          <Separator className="mt-2 border-[#d9d9d9]" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <label className="text-base text-[#858585]">Language</label>
          </div>
          <div className="col-span-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <label className="text-base text-[#858585]">Dark mode</label>
          </div>
          <div className="col-span-2">
            <Select value={darkModeOption} onValueChange={handleDarkModeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button className="bg-[#000000] text-white hover:bg-[#1e1e1e] w-48">Signup</Button>
        </div>
      </div>
    </div>
  );
}