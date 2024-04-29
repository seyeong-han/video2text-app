import React, { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { keys } from "./common/keys";
import "./InputForm.css";
import { Video } from "./common/types";

const WarningIcon:string = require("./common/Warning.svg").default;
interface InputFormProps {
  video: Video;
  setIsSubmitted: (value: boolean) => void;
  isSubmitted: boolean;
  setShowVideoTitle: (value: boolean) => void;
  // setShowCheckWarning: (value: boolean) => void;
  setPrompt: (value: string) => void;
  setPlatform: (value: string) => void;
  // showCheckWarning:boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  video,
  setIsSubmitted,
  isSubmitted,
  setShowVideoTitle,
  // setShowCheckWarning,
  setPrompt,
  setPlatform,
  // showCheckWarning
}) => {
  const [showCheckWarning, setShowCheckWarning] = useState(false);
   console.log("🚀 > showCheckWarning=", showCheckWarning)
  const queryClient = useQueryClient();
  const instagramRef = useRef<HTMLInputElement | null>(null);
  const facebookRef = useRef<HTMLInputElement | null>(null);
  const xRef = useRef<HTMLInputElement | null>(null);
  const blogRef = useRef<HTMLInputElement | null>(null);
  const textRadioRef = useRef<HTMLInputElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  console.log("🚀 > textAreaRef=", textAreaRef)

  const handleOthersSelect = () => {
    setPrompt("")
    setPlatform("")
    setIsSubmitted(false)
    setShowCheckWarning(false);
    queryClient.invalidateQueries({queryKey: [keys.VIDEOS, video?._id, "generate", prompt]});
    if (textAreaRef.current) {
      textAreaRef.current.value="";
      textAreaRef.current.style.display = "block";
    }
  };

  const handleOthersDeselect = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.display = "none";
    }
  };

  const handleRadioChange = () => {
    if (!textRadioRef.current?.checked && textAreaRef.current) {
      handleOthersDeselect();
      setPrompt("")
      setPlatform("")
      setIsSubmitted(false)
      setShowCheckWarning(false);
      queryClient.invalidateQueries({queryKey: [keys.VIDEOS, video?._id, "generate", prompt]});
      textAreaRef.current.value="";
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPrompt("");

    let promptValue = "";
    let platformValue = "";

    if (instagramRef.current?.checked) {
      promptValue = "write a Instagram post with emojis, 100 words or less. Do not provide an explanation. Do not provide a summary.";
      platformValue = "Instagram";
    } else if (facebookRef.current?.checked) {
      promptValue = "write a Facebook post with emojis, 150 words or less. Do not provide an explanation. Do not provide a summary.";
      platformValue = "Facebook";
    } else if (xRef.current?.checked) {
      promptValue = "write a X (formerly Twitter) post with emojis, 50 words or less. Do not provide an explanation. Do not provide a summary.";
      platformValue = "X";
    } else if (blogRef.current?.checked) {
      promptValue = "write a blog post with details. Divide sections with subtitles. Do not provide an explanation. Do not provide a summary.";
      platformValue = "Blog";
    } else if (textRadioRef.current?.checked) {
      const inputValue = textAreaRef.current?.value.trim();
      if (inputValue?.length && inputValue?.length > 0) {
        promptValue = inputValue;
        platformValue = `"${inputValue}"`;
      } else {
        setShowCheckWarning(true);
        return;
      }
    }

    setPrompt(promptValue);
    setIsSubmitted(true);
    setShowVideoTitle(true);
    setPlatform(platformValue);
  }

  return (
    <div className="inputForm" data-cy="data-cy-inputForm">
      <div className="inputForm__title">
        Tell me what social post you want to generate
      </div>
      <form className="inputForm__form" onSubmit={handleSubmit}>
        <label>
          <input
            type="radio"
            className="inputForm__form__radio"
            data-cy="data-cy-inputForm-radio"
            name="platform"
            value="instagram"
            id="instagram"
            ref={instagramRef}
            disabled={isSubmitted}
            onChange={handleRadioChange}
          />
        Instagram
        </label>{" "}
        <label>
          <input
            type="radio"
            className="inputForm__form__radio"
            data-cy="data-cy-inputForm-radio"
            name="platform"
            value="facebook"
            ref={facebookRef}
            disabled={isSubmitted}
            onChange={handleRadioChange}
          />
        Facebook
        </label>{" "}
        <label>
          <input
            type="radio"
            className="inputForm__form__radio"
            data-cy="data-cy-inputForm-radio"
            name="platform"
            value="x"
            ref={xRef}
            disabled={isSubmitted}
            onChange={handleRadioChange}
          />
        X (Twitter)
        </label>{" "}
        <label>
          <input
            type="radio"
            className="inputForm__form__radio"
            data-cy="data-cy-inputForm-radio"
            name="platform"
            value="blog"
            ref={blogRef}
            disabled={isSubmitted}
            onChange={handleRadioChange}
          />
        Blog
        </label>{" "}
        <label>
          <input
            type="radio"
            className="inputForm__form__radio"
            data-cy="data-cy-inputForm-radio"
            name="platform"
            value="others"
            ref={textRadioRef}
            onChange={handleOthersSelect}
            onBlur={(e) => {
              if (!textAreaRef.current?.contains(e.relatedTarget as Node)) {
                handleOthersDeselect();
              }
            }}
            disabled={isSubmitted}
          />
        Others
          <textarea
            className="inputForm__form__textarea"
            data-cy="data-cy-inputForm-textarea"
            id="prompt"
            name="prompt"
            placeholder="Write your prompt here"
            ref={textAreaRef}
            style={{ display: showCheckWarning ? "block" : "none" }}
            disabled={isSubmitted}
            />
             {showCheckWarning && (
            <div className="GenerateSocialPosts__warningMessageWrapper">
              <img
                className="GenerateSocialPosts__warningMessageWrapper__warningIcon"
                src={WarningIcon}
                alt="WarningIcon"
              ></img>
              <div className="GenerateSocialPosts__warningMessageWrapper__warningMessage">
              Please provide the context for the text you'd like to generate
              </div>
            </div>
          )}
          </label>{" "}
        <button
          className="inputForm__form__button"
          data-cy="data-cy-inputForm-button"
          type="submit"
          disabled={isSubmitted}
        >
          Generate
        </button>{" "}
      </form>
    </div>
  );
};
