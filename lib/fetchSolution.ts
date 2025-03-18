import axios from "axios";

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

export async function fetchYouTubeSolution(
  contestName: string
): Promise<string | null> {
  try {
    const response = await axios.get(YOUTUBE_SEARCH_URL, {
      params: {
        key: YOUTUBE_API_KEY,
        q: `${contestName} solution`,
        part: "snippet",
        maxResults: 1,
        type: "video",
      },
    });

    const videos = response.data.items;
    if (videos.length > 0) {
      return `https://www.youtube.com/watch?v=${videos[0].id.videoId}`;
    }

    return null;
  } catch (error) {
    console.error("Error fetching YouTube solutions:", error);
    return null;
  }
}
