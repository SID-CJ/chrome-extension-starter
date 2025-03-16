import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Play, Pause, Clock, Settings } from "lucide-react";
import { useTracksFetch } from "@/api/tracks/useTracksFetch";

export default function AmbientSoundPlayer() {
    const { data, isLoading, isError } = useTracksFetch();

    return (
        <div className="w-120 flex flex-col min-h-screen bg-white">
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
                            data.tracks.map((track, index) => (
                                <SoundCard
                                    key={track.id || index}
                                    title={track.title}
                                    thumbnailUrl={track.thumbnail_url}
                                    active={index === 0}
                                />
                            ))
                        ) : (
                            <div className="col-span-3 text-center text-gray-500">
                                No tracks available
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Fixed Player Controls */}
            {data?.tracks && data.tracks.length > 0 && (
                <div className="border-t border-[#d9d9d9] py-2 px-4">
                    <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {data.tracks[0].thumbnail_url ? (
                                <img
                                    src={data.tracks[0].thumbnail_url}
                                    alt="Playing track thumbnail"
                                    className="w-8 h-8 rounded"
                                />
                            ) : (
                                <div className="w-8 h-8 bg-[#d9d9d9] rounded"></div>
                            )}
                            <span className="text-sm font-medium">{data.tracks[0].title}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                                <Pause className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-[#858585]" />
                                <span className="text-xs text-[#858585]">{data.tracks[0].duration}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Buttons */}
            <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-[#d9d9d9]">
                    <Play className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-[#d9d9d9]">
                </Button>
            </div>
        </div>
    );
}

function SoundCard({ title, thumbnailUrl, active = false }: { title: string; thumbnailUrl?: string | null; active?: boolean }) {
    return (
        <div className="flex flex-col items-start">
            {/* Thumbnail */}
            <div className="aspect-square relative group cursor-pointer w-full">
                <div
                    className={`w-full h-full rounded-md ${active ? "bg-[#121212]" : "bg-[#d9d9d9]"}`}
                    style={thumbnailUrl ? { backgroundImage: `url(${thumbnailUrl})`, backgroundSize: "cover" } : {}}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="icon" className="rounded-full h-8 w-8 bg-white/80 border-none">
                        <Play className="h-4 w-4" />
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