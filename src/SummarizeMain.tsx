import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Video from "./Video";
import { InputForm } from "./InputForm";
import { VideoFileUploadForm } from "./VideoFileUploadForm";
import { Result } from "./Result";
import "./SummarizeMain.css";
import { useGetVideo } from "./common/apiHooks";
import { keys } from "./common/keys";
import LoadingSpinner from "./common/LoadingSpinner";
import { ErrorBoundary } from "./common/ErrorBoundary";

const greenWarningIcon = require("./common/Warning_Green.svg")
  .default as string;

interface SummarizeMainProps {
  index: string;
  videoId: string;
  refetchVideos: () => void;
}

export function SummarizeMain({
  index,
  videoId,
  refetchVideos,
}: SummarizeMainProps): JSX.Element {
  const { data: video, isLoading } = useGetVideo(
    index,
    videoId,
    Boolean(videoId)
  );

  const [field1, field2, field3] = ["summary", "chapter", "highlight"] as const;
  const [field1Prompt, setField1Prompt] = useState<{
    type: string | null;
  } | null>(null);
  const [field2Prompt, setField2Prompt] = useState<{
    type: string | null;
  } | null>(null);
  const [field3Prompt, setField3Prompt] = useState<{
    type: string | null;
  } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showVideoTitle, setShowVideoTitle] = useState<boolean>(false);
  const [showCheckWarning, setShowCheckWarning] = useState<boolean>(false);
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const queryClient = useQueryClient();

  const vidTitleRaw = video?.metadata?.video_title ?? "";
  const vidTitleClean = decodeAndCleanFilename(vidTitleRaw);

  function decodeAndCleanFilename(filename: string): string {
    const decodedFilename = decodeURIComponent(filename);
    const cleanedFilename = decodedFilename
      .replace(/%20/g, " ")
      .replace(/\([^)]*\)/g, "");
    return cleanedFilename;
  }

  async function resetPrompts() {
    setField1Prompt({ type: null });
    setField2Prompt({ type: null });
    setField3Prompt({ type: null });
  }

  useEffect(() => {
    const fetchData = async () => {
      await queryClient.invalidateQueries({
        queryKey: [keys.VIDEOS, index, videoId],
      });
    };
    fetchData();
  }, [index, videoId, queryClient]);

  return (
    <div className="summarizeVideo">
      <h1 className="summarizeVideo__appTitle">Summarize a YouTube Video</h1>
      <ErrorBoundary>
        {isLoading && <LoadingSpinner />}
        <VideoFileUploadForm
          index={index}
          refetchVideos={refetchVideos}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          isFileUploading={isFileUploading}
          setIsFileUploading={setIsFileUploading}
        />
        {!isLoading && !video && (
          <div className="GenerateSocialPosts__uploadMessageWrapper">
            <img
              className="GenerateSocialPosts__uploadMessageWrapper__warningIcon"
              src={greenWarningIcon}
              alt="greenWarningIcon"
            />
            <div>
              <p className="GenerateSocialPosts__uploadMessageWrapper__message">
                Please upload a video
              </p>
            </div>
          </div>
        )}
        {!isFileUploading && video && (
          <>
            <Video url={video.hls?.video_url} width="381px" height="214px" />
            {showVideoTitle && (
              <div className="GenerateSocialPosts__videoTitle">
                {vidTitleClean}
              </div>
            )}
            <InputForm
              video={video}
              setField1Prompt={setField1Prompt}
              setField2Prompt={setField2Prompt}
              setField3Prompt={setField3Prompt}
              field1={field1}
              field2={field2}
              field3={field3}
              setIsSubmitted={setIsSubmitted}
              setShowVideoTitle={setShowVideoTitle}
              setShowCheckWarning={setShowCheckWarning}
            />
            <Result
              video={video}
              isSubmitted={isSubmitted}
              field1Prompt={field1Prompt}
              field2Prompt={field2Prompt}
              field3Prompt={field3Prompt}
            />
          </>
        )}
      </ErrorBoundary>
    </div>
  );
}
