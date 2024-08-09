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

  const [field1, field2, field3, field4, field5, field6] = [
    "topic",
    "title",
    "hashtag",
    "summary",
    "chapter",
    "highlight",
  ] as const;
  const [fieldTypes, setFieldTypes] = useState<Set<string>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showVideoTitle, setShowVideoTitle] = useState<boolean>(false);
  const [showCheckWarning, setShowCheckWarning] = useState<boolean>(false);
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>("");

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

  async function resetFieldTypes() {
    setFieldTypes(new Set());
  }

  useEffect(() => {
    const fetchData = async () => {
      await queryClient.invalidateQueries({
        queryKey: [keys.VIDEOS, index, videoId],
      });
    };
    fetchData();
    resetFieldTypes();
    setIsSubmitted(false);
    setShowVideoTitle(false);
    setShowCheckWarning(false);
    setSelectedFile(null);
    setIsFileUploading(false);
  }, [index, videoId, queryClient]);

  return (
    <div className="summarizeVideo">
      <h1 className="summarizeVideo__appTitle">Summarize Your Video</h1>
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
          <div className="summarizeVideo__uploadMessageWrapper">
            <img
              className="summarizeVideo__uploadMessageWrapper__warningIcon"
              src={greenWarningIcon}
              alt="greenWarningIcon"
            />
            <div>
              <p className="summarizeVideo__uploadMessageWrapper__message">
                Please upload a video
              </p>
            </div>
          </div>
        )}
        {showCheckWarning && (
          <div className="summarizeVideo__warningMessageWrapper">
            <img
              className="summarizeVideo__warningMessageWrapper__warningIcon"
              src={greenWarningIcon}
              alt="WarningIcon"
            ></img>
            <div className="summarizeVideo__warningMessageWrapper__warningMessage">
              Please select one of the checkboxes
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
              field1={field1}
              field2={field2}
              field3={field3}
              field4={field4}
              field5={field5}
              field6={field6}
              fieldTypes={fieldTypes}
              isSubmitted={isSubmitted}
              showCheckWarning={showCheckWarning}
              setPrompt={setPrompt}
              setIsSubmitted={setIsSubmitted}
              setShowVideoTitle={setShowVideoTitle}
              setShowCheckWarning={setShowCheckWarning}
            />
            <Result
              video={video}
              isSubmitted={isSubmitted}
              fieldTypes={fieldTypes}
              prompt={prompt}
            />
          </>
        )}
      </ErrorBoundary>
    </div>
  );
}
