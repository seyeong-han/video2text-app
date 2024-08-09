import React, { useEffect } from "react";
import Video from "./Video";
import { useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "./common/LoadingSpinner";
import "./Result.css";
import {
  useGenerateSummary,
  useGenerateChapters,
  useGenerateHighlights,
  useGenerateTitleTopicHashtag,
} from "./common/apiHooks";
import { keys } from "./common/keys";
import { ErrorBoundary } from "./common/ErrorBoundary";
import { Video as TypeVideo } from "./common/types";

/** Shows the results
 *
 * SummarizeMain -> Result
 *
 */

interface ResultProps {
  video: TypeVideo;
  isSubmitted: boolean;
  fieldTypes: Set<string>;
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

export function Result({ video, isSubmitted, fieldTypes }: ResultProps) {
  const { data: summaryResult } = useGenerateSummary(
    { type: "summary" },
    video?._id,
    Boolean(video?._id && fieldTypes.has("summary") && isSubmitted)
  );

  const { data: chaptersResult } = useGenerateChapters(
    { type: "chapter" },
    video?._id,
    Boolean(video?._id && fieldTypes.has("chapter") && isSubmitted)
  );

  const { data: highlightsResult } = useGenerateHighlights(
    { type: "highlight" },
    video?._id,
    Boolean(video?._id && fieldTypes.has("highlight") && isSubmitted)
  );

  const types = new Set(
    [...fieldTypes].filter(
      (type) => !["summary", "chapter", "highlight"].includes(type)
    )
  );

  console.log("types", types);

  const { data: titleTopicHashtagResults } = useGenerateTitleTopicHashtag(
    types,
    video?._id,
    Boolean(video?._id && types?.size > 0 && isSubmitted)
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [
        keys.VIDEOS,
        video?._id,
        "summarize",
        "chapters",
        "highlights",
      ],
    });
    console.log("titleTopicHashtagResults", titleTopicHashtagResults);
  }, [fieldTypes, video?._id, queryClient]);

  /** Format seconds to hours:minutes:seconds */
  function formatTime(timeInSeconds: number): string {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    return formattedTime;
  }

  return (
    <ErrorBoundary>
      <div className="result">
        {titleTopicHashtagResults && isSubmitted && (
          <>
            {/* Display topics */}
            {titleTopicHashtagResults.topics?.length > 0 ? (
              <div className="result__topics">
                <h2 className="result__topics__title">Topic</h2>
                <div className="result__topics__topics">
                  {titleTopicHashtagResults.topics.map((topic: string) => (
                    <div className="result__topics__topic" key={topic}>
                      {topic}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No topics available</p>
            )}

            {/* Display title */}
            {titleTopicHashtagResults.title?.length > 0 ? (
              <div className="result__title">
                <h2 className="result__title__title">Title</h2>
                <div className="result__title__titleData">
                  {titleTopicHashtagResults.title}
                </div>
              </div>
            ) : (
              <p>No title available</p>
            )}

            {/* Display hashtags */}
            {titleTopicHashtagResults.hashtags?.length > 0 ? (
              <div className="result__hashtags">
                <h2 className="result__hashtags__title">Hashtags</h2>
                <div className="result__hashtags__hashtags">
                  {titleTopicHashtagResults.hashtags.map((hashtag: string) => (
                    <div className="result__hashtags__hashtag" key={hashtag}>
                      #{hashtag}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No hashtags available</p>
            )}
          </>
        )}
        {fieldTypes.has("summary") && isSubmitted && (
          <div className="result__summary">
            <h2 className="result__summary__title">Sentences</h2>
            {summaryResult ? (
              <div className="result__summary__summary">
                {summaryResult.summary}
              </div>
            ) : (
              <LoadingSpinner />
            )}
          </div>
        )}
        {fieldTypes.has("chapter") && isSubmitted && (
          <div className="result__chapters">
            <h2 className="result__chapters__title">Chapters</h2>
            <div className="result__chapters__wrapper">
              {chaptersResult &&
                Array.isArray(chaptersResult.chapters) &&
                chaptersResult.chapters.map((chapter: Chapter) => (
                  <div
                    className="result__chapters__wrapper__chapter"
                    key={chapter.chapter_title}
                  >
                    <Video
                      url={video.hls?.video_url}
                      start={chapter.start}
                      end={chapter.end}
                      width={"221px"}
                      height={"120px"}
                    />
                    <div className="result__chapters__wrapper__chapter__wrapper">
                      <div className="result__chapters__wrapper__chapter__wrapper_titleTime">
                        <div className="result__chapters__wrapper__chapter__wrapper_titleTime_title">
                          {chapter.chapter_title}
                        </div>
                        <div className="result__chapters__wrapper__chapter__wrapper_titleTime_time">
                          {formatTime(chapter.start)} -{" "}
                          {formatTime(chapter.end)}
                        </div>
                      </div>
                      <div className="result__chapters__wrapper__chapter__wrapper__summary">
                        {chapter.chapter_summary}
                      </div>
                    </div>
                  </div>
                ))}
              {chaptersResult && !chaptersResult.chapters && (
                <p className="result__chapters__wrapper__message">
                  No chapters available
                </p>
              )}
              {!chaptersResult && <LoadingSpinner />}
            </div>
          </div>
        )}
        {fieldTypes.has("highlight") && isSubmitted && (
          <div className="result__highlights">
            <h2 className="result__highlights__title">Highlights</h2>
            <div className="result__highlights__wrapper">
              {highlightsResult &&
                Array.isArray(highlightsResult.highlights) &&
                highlightsResult.highlights.map((highlight: Highlight) => (
                  <div
                    className="result__highlights__wrapper__highlight"
                    key={highlight.highlight}
                  >
                    <Video
                      url={video.hls?.video_url}
                      start={highlight.start}
                      end={highlight.end}
                      width={"221px"}
                      height={"120px"}
                    />
                    <div className="result__highlights__wrapper__highlight__timeSummary">
                      <div className="result__highlights__wrapper__highlight__timeSummary__time">
                        {formatTime(highlight.start)} -{" "}
                        {formatTime(highlight.end)}
                      </div>
                      <div className="result__highlights__wrapper__highlight__timeSummary__summary">
                        {highlight.highlight_summary || highlight.highlight}
                      </div>
                    </div>
                  </div>
                ))}
              {highlightsResult && !highlightsResult.highlights && (
                <p className="result__highlights__wrapper__message">
                  No highlights available
                </p>
              )}
              {!highlightsResult && <LoadingSpinner />}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
