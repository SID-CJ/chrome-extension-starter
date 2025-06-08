"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
//import { Card, CardContent } from "@/components/ui/card";
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
  language: string;
  setLanguage: (value: string) => void;
  quoteFrequency: string;
  setQuoteFrequency: (value: string) => void;
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
  //language,
  //setLanguage,
  quoteFrequency,
  setQuoteFrequency
}: SettingsPanelProps) {
  const { theme, setTheme } = useTheme(); // Use theme and setTheme from ThemeProvider
  
  // Initialize darkModeOption to match the current theme setting
  const [darkModeOption, setDarkModeOption] = useState<'dark' | 'light' | 'system'>(
    theme as 'dark' | 'light' | 'system'
  );

  // Handle dark mode changes
  const handleDarkModeChange = (value: 'dark' | 'light' | 'system') => {
    setDarkModeOption(value);
    setTheme(value); // Update theme via ThemeProvider
    
    // Sync parent state based on the current or system preference
    if (value === "dark") {
      setDarkMode(true);
    } else if (value === "light") {
      setDarkMode(false);
    } else { // system
      // For system mode, check the system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }
  };

  return (
    <div className="w-150 bg-background text-foreground p-6 overflow-y-auto h-full shadow-lg border-r border-input relative">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <Separator className="mb-6" />

      {/* <Card className="bg-primary text-primary-foreground mb-8">
        <CardContent className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <p className="text-xl mb-4">
            Get a <span className="font-bold">Life-Time</span> account for just{" "}
            <span className="font-bold">$10/-</span>
          </p>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors w-48 mb-4 font-medium"
          >
            Get it now
          </Button>
          <p className="text-sm opacity-80">open to a limited number of users</p>
        </CardContent>
      </Card> */}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="cctext-xl font-medium">Time and date</h3>
          <Switch
            checked={timeAndDateVisible}
            onCheckedChange={setTimeAndDateVisible}
            className="data-[state=checked]:bg-[#65d46e]"
          />
        </div>
        <Separator />

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <label className="text-base text-muted-foreground">Time format</label>
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
            <label className="text-base text-muted-foreground">Date format</label>
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
          <h3 className="text-xl font-medium">Quotes</h3>
          <Switch
            checked={quotesVisible}
            onCheckedChange={setQuotesVisible}
            className="data-[state=checked]:bg-[#65d46e]"
          />
        </div>
        <Separator />

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <label className="text-base text-muted-foreground">Frequency</label>
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
          <h3 className="text-xl font-medium">General settings</h3>
          <Separator className="mt-2" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* <div className="flex items-center">
            <label className="text-base text-muted-foreground">Language</label>
          </div> */}
          {/* <div className="col-span-2">
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
          </div> */}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <label className="text-base text-muted-foreground">Dark mode</label>
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
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-48">Signup</Button>
        </div>
      </div>
    </div>
  );
}