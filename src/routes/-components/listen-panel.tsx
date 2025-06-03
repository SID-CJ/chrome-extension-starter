import { Clock, Pause, Play, Repeat } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import PlayerService from "@/services/PlayerService";
import { Separator } from "@/components/ui/separator";
import { Track } from "@/api/tracks/useTracksFetch";
import { useTracksFetch } from "@/api/tracks/useTracksFetch";

export default function AmbientSoundPlayer() {
  const { data, isLoading, isError } = useTracksFetch();

  const player = PlayerService;

  // Subscribe to PlayerService states
  const [isPlaying, setIsPlaying] = useState(player.isPlaying());
  const [isLooping, setIsLooping] = useState(player.isLoopingEnabled());
  const [remainingTime, setRemainingTime] = useState(player.getRemainingTime());
  const [activeTrackId, setActiveTrackId] = useState(player.getCurrentTrackId());

  useEffect(() => {
    // Subscribe to PlayerService updates
    const unsubscribePlaying = player.subscribe(setIsPlaying);
    const unsubscribeLooping = player.subscribeToLoop(setIsLooping);
    const unsubscribeTimer = player.subscribeToTimer(setRemainingTime);

    // Update activeTrackId when the track changes
    const updateActiveTrackId = () => setActiveTrackId(player.getCurrentTrackId());
    player.subscribe(updateActiveTrackId);

    return () => {
      unsubscribePlaying();
      unsubscribeLooping();
      unsubscribeTimer();
    };
  }, [player]);

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


  const handleTrackSelect = (track: Track) => {
    if (player.getCurrentTrackId() === track.id) {
      if (player.isPlaying()) {
        player.pause();
      } else {
        player.play();
      }
    } else {
      player.setLoop(false);
      player.setRemainingTime(null);
      player.loadTrack(track, true);
    }
  };

  const toggleLoop = () => {
    player.setLoop(!player.isLoopingEnabled());
  };

  const setTimer = (minutes: number) => {
    const seconds = minutes * 60;
    player.setRemainingTime(seconds);
    player.setLoop(true);
  };

  // Format remaining time as MM:SS
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-150 flex flex-col min-h-screen bg-background text-foreground">
      {/* Main Content Area - Scrollable */}
      <div className="flex-1 max-w-3xl mx-auto w-full p-4 overflow-y-auto">
        <div className="space-y-1 mb-4">
          <h1 className="text-3xl font-bold">Listen now</h1>
          <p className="text-sm text-muted-foreground">Ambient sounds picked for your mood</p>
        </div>

        <Tabs defaultValue="all" className="mb-4">
          <TabsList className="bg-background border border-input rounded-full p-1 h-10 w-full">
            <TabsTrigger
              value="all"
              className="rounded-full px-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="work"
              className="rounded-full px-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Work
            </TabsTrigger>
            <TabsTrigger
              value="focus"
              className="rounded-full px-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Focus
            </TabsTrigger>
            <TabsTrigger
              value="study"
              className="rounded-full px-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Study
            </TabsTrigger>
            <TabsTrigger
              value="relax"
              className="rounded-full px-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Relax
            </TabsTrigger>
            <TabsTrigger
              value="meditate"
              className="rounded-full px-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Meditate
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Separator className="mb-4" />

        {/* Tracks Grid */}
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading tracks...</div>
        ) : isError ? (
          <div className="text-center text-destructive">Failed to load tracks</div>
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
                  isPlaying={track.id === activeTrackId && isPlaying}
                />
              ))
            ) : (
              <div className="col-span-3 text-center text-muted-foreground">No tracks available</div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Player Controls */}
      {data?.tracks && data.tracks.length > 0 && (
        <div className="border-t border-input py-2 px-4">
          <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeTrackId && data.tracks.find((t) => t.id === activeTrackId)?.thumbnail_url ? (
                <img
                  src={data.tracks.find((t) => t.id === activeTrackId)!.thumbnail_url!}
                  alt="Playing track thumbnail"
                  className="w-8 h-8 rounded"
                />
              ) : (
                <div className="w-8 h-8 bg-muted rounded"></div>
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
                    ? isPlaying
                      ? player.pause()
                      : player.play()
                    : handleTrackSelect(data.tracks[0])
                }
              >
                {activeTrackId && isPlaying ? (
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
                  <span className="text-xs text-muted-foreground">{formatTime(remainingTime)}</span>
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
          className={`w-full h-full rounded-none ${active ? "bg-primary/20" : "bg-muted"}`}
          style={thumbnailUrl ? { backgroundImage: `url(${thumbnailUrl})`, backgroundSize: "cover" } : {}}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="outline" size="icon" className="rounded-full h-8 w-8 bg-background/80 border-none">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {/* Title with Scroll Animation */}
      {title && (
        <div className="mt-2 w-full overflow-hidden">
          <h3
            className={`text-sm font-medium whitespace-nowrap ${
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