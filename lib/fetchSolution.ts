import axios from "axios";

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

interface YouTubeSearchParams {
  key: string;
  q: string;
  part: string;
  maxResults: number;
  type: string;
  order: string;
  publishedAfter: string;
  channelId?: string;
}

interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
  };
}

export async function fetchYouTubeSolution(
  contestName: string,
  platform?: string,
  channelId?: string
): Promise<string | null> {
  try {
    console.log(`[YouTube] Starting search for: ${contestName}`);
    console.log(`[YouTube] API Key present: ${!!YOUTUBE_API_KEY}`);

    if (!YOUTUBE_API_KEY) {
      console.error("[YouTube] No API key found!");
      return null;
    }

    // Create more specific search queries
    const searchQueries = [
      `${contestName} ${platform || ""} solution editorial`,
      `${contestName} ${platform || ""} tutorial`,
      `${contestName} solution`,
      contestName.replace(/[^\w\s]/gi, "") + " solution", // Remove special characters
    ];

    for (const query of searchQueries) {
      console.log(`[YouTube] Searching for: "${query}"`);

      const params: YouTubeSearchParams = {
        key: YOUTUBE_API_KEY!,
        q: query.trim(),
        part: "snippet",
        maxResults: 5, // Get more results to find better matches
        type: "video",
        order: "relevance",
        publishedAfter: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // Last 30 days
      };

      // If channelId is provided, search within specific channel
      if (channelId) {
        params.channelId = channelId;
      }

      const response = await axios.get(YOUTUBE_SEARCH_URL, { params });

      console.log(`[YouTube] API Response status: ${response.status}`);
      console.log(`[YouTube] Found ${response.data.items?.length || 0} videos`);

      const videos: YouTubeVideo[] = response.data.items || [];

      if (videos.length > 0) {
        // Find the most relevant video based on title similarity
        const bestMatch = videos.find((video: YouTubeVideo) => {
          const title = video.snippet.title.toLowerCase();
          const searchTerm = contestName.toLowerCase();

          // Check if title contains contest name or similar keywords
          return (
            title.includes(searchTerm) ||
            title.includes(searchTerm.replace(/[^\w\s]/gi, "")) ||
            title.includes("solution") ||
            title.includes("editorial") ||
            title.includes("tutorial")
          );
        });

        if (bestMatch) {
          console.log(`[YouTube] Found best match: ${bestMatch.snippet.title}`);
          return `https://www.youtube.com/watch?v=${bestMatch.id.videoId}`;
        }

        // If no perfect match, return the first result
        console.log(`[YouTube] Using first result: ${videos[0].snippet.title}`);
        return `https://www.youtube.com/watch?v=${videos[0].id.videoId}`;
      }

      console.log(`[YouTube] No results for query: "${query}"`);
    }

    console.log(`[YouTube] No solution found for: ${contestName}`);
    return null;
  } catch (error) {
    console.error("[YouTube] Error details:", error);
    if (axios.isAxiosError(error)) {
      console.error("[YouTube] Status:", error.response?.status);
      console.error("[YouTube] Response:", error.response?.data);
    }
    return null;
  }
}
