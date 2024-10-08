import { useQuery, QueryClient } from "@tanstack/react-query";
import { keys } from "./keys";
import apiConfig from "./apiConfig";
import { Task } from "./types";

export function useGetVideos(indexId: string | undefined) {
  return useQuery({
    queryKey: [keys.VIDEOS, indexId],
    queryFn: async () => {
      try {
        if (!indexId) throw new Error("indexId is undefined");
        const response = await apiConfig.SERVER.get(
          `${apiConfig.INDEXES_URL}/${indexId}/videos`,
          {
            params: { page_limit: apiConfig.PAGE_LIMIT },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching videos:", error);
        throw error;
      }
    },
  });
}

export function useGetVideo(
  indexId: string,
  videoId: string,
  enabled: boolean
) {
  return useQuery({
    queryKey: [keys.VIDEOS, indexId, videoId],
    queryFn: async () => {
      try {
        if (!enabled) {
          return null;
        }
        const response = await apiConfig.SERVER.get(
          `${apiConfig.INDEXES_URL}/${indexId}/videos/${videoId}`
        );

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        return response.data;
      } catch (error) {
        console.error("useGetVideo hook error:", error);
        throw error;
      }
    },
    enabled: enabled,
  });
}

export function useGenerate(prompt: string, videoId: string, enabled: boolean) {
  return useQuery({
    queryKey: [keys.VIDEOS, "generate", videoId, prompt],
    queryFn: async () => {
      try {
        if (!enabled) {
          return null;
        }

        const response = await apiConfig.SERVER.post(
          `/videos/${videoId}/generate`,
          {
            data: { prompt: prompt },
          }
        );
        const respData = response.data;
        return respData;
      } catch (error) {
        console.error("Error generating video data:", error);
        throw error;
      }
    },
    enabled: enabled,
  });
}

export async function fetchVideoInfo(
  queryClient: QueryClient,
  url: string
): Promise<any> {
  try {
    const response = await queryClient.fetchQuery({
      queryKey: [keys.VIDEO, url],
      queryFn: async () => {
        const response = await apiConfig.SERVER.get(
          `/video-info?url=${encodeURIComponent(url)}`
        );
        return response.data;
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching video information:", error);
    throw error;
  }
}

export function useGenerateSummary(
  data: any,
  videoId: string,
  enabled: boolean
) {
  return useQuery({
    queryKey: [keys.VIDEOS, "summarize", videoId],
    queryFn: async () => {
      try {
        if (!enabled) {
          return null;
        }

        const response = await apiConfig.SERVER.post(
          `/videos/${videoId}/summarize`,
          { data }
        );
        return response.data;
      } catch (error) {
        console.error("Error generating summary:", error);
        throw error;
      }
    },
    enabled: enabled,
  });
}

export function useGenerateChapters(
  data: any,
  videoId: string,
  enabled: boolean
) {
  return useQuery({
    queryKey: [keys.VIDEOS, "chapters", videoId],
    queryFn: async () => {
      try {
        if (!enabled) {
          return null;
        }

        const response = await apiConfig.SERVER.post(
          `/videos/${videoId}/summarize`,
          { data }
        );
        return response.data;
      } catch (error) {
        console.error("Error generating chapters:", error);
        throw error;
      }
    },
    enabled: enabled,
  });
}

export function useGenerateHighlights(
  data: any,
  videoId: string,
  enabled: boolean
) {
  return useQuery({
    queryKey: [keys.VIDEOS, "highlights", videoId],
    queryFn: async () => {
      try {
        if (!enabled) {
          return null;
        }

        const response = await apiConfig.SERVER.post(
          `/videos/${videoId}/summarize`,
          { data }
        );
        return response.data;
      } catch (error) {
        console.error("Error generating highlights:", error);
        throw error;
      }
    },
    enabled: enabled,
  });
}

export function useGetTask(taskId: string) {
  return useQuery<Task, Error, Task, [string, string]>({
    queryKey: [keys.TASK, taskId],
    queryFn: async (): Promise<Task> => {
      try {
        const response = await apiConfig.SERVER.get(
          `${apiConfig.TASKS_URL}/${taskId}`
        );
        const respData: Task = response.data;
        return respData;
      } catch (error) {
        console.error("Error fetching task:", error);
        throw error;
      }
    },
    refetchInterval: (query) => {
      const data = query.state.data;
      return data && (data.status === "ready" || data.status === "failed")
        ? false
        : 5000;
    },
    refetchIntervalInBackground: true,
  });
}

export function useGenerateTitleTopicHashtag(
  types: Set<string>,
  videoId: string,
  enabled: boolean
) {
  return useQuery({
    queryKey: [keys.VIDEOS, "gist", videoId],
    queryFn: async () => {
      try {
        if (!enabled) {
          return null;
        }

        const response = await apiConfig.SERVER.post(
          `/videos/${videoId}/gist`,
          {
            data: { types: Array.from(types) },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error generating title, topic, and hashtag:", error);
        throw error;
      }
    },
    enabled: enabled,
  });
}
