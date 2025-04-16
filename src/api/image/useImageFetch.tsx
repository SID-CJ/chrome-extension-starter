import axios from "@/api/axios.ts";
import { useQuery } from "@tanstack/react-query";

export interface Image {
    id: number;
    thumbnail_url: string;
    original_image_url: string;
    page_url: string;
    tags: string;
    photographer: string;
    photographer_url: string;
}

export interface ImageResponse {
    images: Image[];
}

export const imagesKeys = {
    all: ["images"] as const,
    lists: () => [...imagesKeys.all, "list"] as const,
} as const;

export const useImageFetch = () => {
    const fetchImages = async (): Promise<ImageResponse> => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const response = await axios.get("/extension/images/", {
            headers: { "Time-Zone": timezone },
        });
        
        console.log("Raw API response:", response.data);

        let images = [];
        if (response.data?.images) {
            images = response.data.images;
        } else if (Array.isArray(response.data)) {
            images = response.data;
        } else {
            console.warn("Unexpected response format:", response.data);
            images = [];
        }

        return {
            images,
        };
    };

    return useQuery({
        queryKey: imagesKeys.lists(),
        queryFn: fetchImages,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
};