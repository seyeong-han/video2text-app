import  React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import "./Result.css";
import { useGenerate } from "./common/apiHooks";
import { keys } from "./common/keys";
import { ErrorBoundary } from "./common/ErrorBoundary";
import { Video as TypeVideo } from "./common/types";

interface ResultProps {
  video: TypeVideo;
  isSubmitted: boolean;
  field1Prompt: { type: string | null } | null;
  field2Prompt: { type: string | null } | null;
  field3Prompt: { type: string | null } | null;
}

interface Chapter {
  chapter_title: string;
  start: number;
  end: number;
  chapter_summary: string;
}

interface Highlight {
  highlight: string;
  start: number;
  end: number;
  highlight_summary?: string;
}

    video?._id,
    Boolean(video?._id && prompt?.length > 0 && isSubmitted)
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({queryKey: [keys.VIDEOS, video?._id, "generate", prompt]});
  }, [prompt, video?._id, isSubmitted]);

  useEffect(() => {
    if (!isLoading && !isFetching) {
    setIsSubmitted(false);}
  })

  return (
    <ErrorBoundary>
      <div className="result">
        {!isLoading && !isFetching && result && (
          <>
            {" "}
            <div className="result__resultTitle">Generated Post for {platform.length > 0 ? platform : prompt }</div>
            <div className="result__resultData" data-cy="data-cy-resultData">
              {result.data.split("\n").map((paragraph:string, index:number) => (
                <p key={index}>{paragraph}</p>
              ))}
              </div>
          </>
        )}
        {(isLoading || isFetching) && <LoadingSpinner />}
      </div>
    </ErrorBoundary>
  );
}
