import axios from "@/api/axios.ts";
import { useQuery } from "@tanstack/react-query";

export interface Track {
    id: string;
    title: string;
    description: string;
    artist: string;
    artist_name: string;
    duration: string;
    thumbnail_url: string | null;
    is_favorite: boolean;
    stream_url: string;
}

export interface FullTrackResponse {
    tracks: Track[];
    current_time: string;
    mood_category: string[];
    suggested_moods: string[];
}

export const tracksKeys = {
    all: ["tracks"] as const,
    lists: () => [...tracksKeys.all, "list"] as const,
} as const;

export const useTracksFetch = () => {
    const fetchTracks = async (): Promise<FullTrackResponse> => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const response = await axios.get("/tracks/listen/", {
            headers: { "Time-Zone": timezone },
        });
        
        console.log("Raw API response:", response.data); // Debug output

        // Handle different response structures
        let tracks = [];
        if (Array.isArray(response.data)) {
            tracks = response.data; // Direct array of tracks
        } else if (response.data?.results) {
            tracks = response.data.results; // Object with results array
        } else {
            console.warn("Unexpected response format:", response.data);
            tracks = []; // Fallback to empty array
        }

        return {
            tracks,
            current_time: new Date().toISOString(),
            mood_category: [],
            suggested_moods: [],
        };
    };

    return useQuery({
        queryKey: tracksKeys.lists(),
        queryFn: fetchTracks,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
};