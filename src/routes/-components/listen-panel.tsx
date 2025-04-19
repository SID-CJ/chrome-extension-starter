import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Play, Pause, Repeat, Clock } from "lucide-react";
import { useTracksFetch } from "@/api/tracks/useTracksFetch";
import PlayerService from "@/services/PlayerService";
import { Track } from "@/api/tracks/useTracksFetch";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function AmbientSoundPlayer() {
  const { data, isLoading, isError } = useTracksFetch();
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [isLooping, setIsLooping] = useState(false);
  const [timerDuration, setTimerDuration] = useState<number | null>(null); // Duration in seconds
  const [remainingTime, setRemainingTime] = useState<number | null>(null); // Remaining time in seconds
  const player = PlayerService;

  // Cleanup player only when tab is closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      player.destroy();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [player]);

  // Sync looping state with PlayerService
  useEffect(() => {
    player.setLoop(isLooping);
  }, [isLooping, player]);

  // Handle timer countdown
  useEffect(() => {
    if (remainingTime === null || remainingTime <= 0) {
      if (remainingTime === 0) {
        setIsLooping(false); // Stop looping when timer hits zero
        setTimerDuration(null);
      }
      return;
    }

    const interval = setInterval(() => {
      setRemainingTime((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime]);

  const handleTrackSelect = (track: Track) => {
    if (activeTrackId === track.id) {
      if (player.isPlaying()) {
        player.pause();
      } else {
        player.play();
      }
    } else {
      player.loadTrack(track, true);
      setActiveTrackId(track.id);
    }
  };

  const toggleLoop = () => {
    if (!isLooping && timerDuration === null) {
      // If not looping and no timer set, just enable looping without timer
      setIsLooping(true);
    } else {
      // If looping or timer is active, stop looping and reset timer
      setIsLooping(false);
      setTimerDuration(null);
      setRemainingTime(null);
    }
  };

  const setTimer = (minutes: number) => {
    const seconds = minutes * 60;
    setTimerDuration(seconds);
    setRemainingTime(seconds);
    setIsLooping(true); // Enable looping when timer is set
  };

  // Format remaining time as MM:SS
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-150 flex flex-col min-h-screen bg-white">
      {/* Main Content Area - Scrollable */}
      <div className="flex-1 max-w-3xl mx-auto w-full p-4 overflow-y-auto">
        <div className="space-y-1 mb-4">
          <h1 className="text-3xl font-bold text-[#000000]">Listen now</h1>
          <p className="text-sm text-[#858585]">Ambient sounds picked for your mood</p>
        </div>

        <Tabs defaultValue="all" className="mb-4">
          <TabsList className="bg-white border border-[#d9d9d9] rounded-full p-1 h-10 w-full">
            <TabsTrigger
              value="all"
              className="rounded-full px-3 text-sm data-[state=active]:bg-[#000000] data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="work"
              className="rounded-full px-3 text-sm data-[state=active]:bg-[#000000] data-[state=active]:text-white"
            >
              Work
            </TabsTrigger>
            <TabsTrigger
              value="focus"
              className="rounded-full px-3 text-sm data-[state=active]:bg-[#000000] data-[state=active]:text-white"
            >
              Focus
            </TabsTrigger>
            <TabsTrigger
              value="study"
              className="rounded-full px-3 text-sm data-[state=active]:bg-[#000000] data-[state=active]:text-white"
            >
              Study
            </TabsTrigger>
            <TabsTrigger
              value="relax"
              className="rounded-full px-3 text-sm data-[state=active]:bg-[#000000] data-[state=active]:text-white"
            >
              Relax
            </TabsTrigger>
            <TabsTrigger
              value="meditate"
              className="rounded-full px-3 text-sm data-[state=active]:bg-[#000000] data-[state=active]:text-white"
            >
              Meditate
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Separator className="mb-4" />

        {/* Tracks Grid */}
        {isLoading ? (
          <div className="text-center text-gray-500">Loading tracks...</div>
        ) : isError ? (
          <div className="text-center text-red-500">Failed to load tracks</div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {data && data.tracks && data.tracks.length > 0 ? (
              data.tracks.map((track) => (
                <SoundCard
                  key={track.id}
                  title={track.title}
                  thumbnailUrl={track.thumbnail_url}
                  active={track.id === activeTrackId}
                  onSelect={() => handleTrackSelect(track)}
                  isPlaying={track.id === activeTrackId && player.isPlaying()}
                />
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">No tracks available</div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Player Controls */}
      {data?.tracks && data.tracks.length > 0 && (
        <div className="border-t border-[#d9d9d9] py-2 px-4">
          <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeTrackId && data.tracks.find((t) => t.id === activeTrackId)?.thumbnail_url ? (
                <img
                  src={data.tracks.find((t) => t.id === activeTrackId)!.thumbnail_url!}
                  alt="Playing track thumbnail"
                  className="w-8 h-8 rounded"
                />
              ) : (
                <div className="w-8 h-8 bg-[#d9d9d9] rounded"></div>
              )}
              <span className="text-sm font-medium">
                {activeTrackId
                  ? data.tracks.find((t) => t.id === activeTrackId)?.title
                  : data.tracks[0].title}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8"
                onClick={() =>
                  activeTrackId
                    ? player.isPlaying()
                      ? player.pause()
                      : player.play()
                    : handleTrackSelect(data.tracks[0])
                }
              >
                {activeTrackId && player.isPlaying() ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              {/* Loop Toggle Button with Timer */}
              <div className="flex items-center gap-2">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full h-8 w-8 ${isLooping ? "text-[#65d46e]" : ""}`}
                      onClick={toggleLoop}
                    >
                      {remainingTime !== null ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <Repeat className="h-4 w-4" />
                      )}
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-40">
                    <div className="flex flex-col gap-2">
                      <h4 className="text-sm font-medium">Set Loop Timer</h4>
                      <Button variant="ghost" onClick={() => setTimer(15)}>
                        15 min
                      </Button>
                      <Button variant="ghost" onClick={() => setTimer(60)}>
                        1 hr
                      </Button>
                      <Button variant="ghost" onClick={() => setTimer(120)}>
                        2 hr
                      </Button>
                      <Button variant="ghost" onClick={() => setTimer(180)}>
                        3 hr
                      </Button>
                      <Button variant="ghost" onClick={() => setTimer(300)}>
                        5 hr
                      </Button>
                      <Button variant="ghost" onClick={() => setTimer(480)}>
                        8 hr
                      </Button>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                {remainingTime !== null && (
                  <span className="text-xs text-[#858585]">{formatTime(remainingTime)}</span>
                )}
              </div>
              
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function SoundCard({
  title,
  thumbnailUrl,
  active = false,
  onSelect,
  isPlaying = false,
}: {
  title: string;
  thumbnailUrl?: string | null;
  active?: boolean;
  onSelect: () => void;
  isPlaying?: boolean;
}) {  
  return (
    <div className="flex flex-col items-start max-w-[180px]">
      {/* Thumbnail */}
      <div className="aspect-square relative group cursor-pointer w-full" onClick={onSelect}>
        <div
          className={`w-full h-full rounded-none ${active ? "bg-[#121212]" : "bg-[#d9d9d9]"}`}
          style={thumbnailUrl ? { backgroundImage: `url(${thumbnailUrl})`, backgroundSize: "cover" } : {}}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="outline" size="icon" className="rounded-full h-8 w-8 bg-white/80 border-none">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {/* Title with Scroll Animation */}
      {title && (
        <div className="mt-2 w-full overflow-hidden">
          <h3
            className={`text-sm font-medium text-[#121212] whitespace-nowrap ${
              title.length > 20 ? "animate-marquee" : ""
            }`}
          >
            {title}
          </h3>
        </div>
      )}
    </div>
  );
}