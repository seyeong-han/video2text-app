import React, { useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { keys } from "./common/keys";
import { Video } from "./common/types";
import "./InputForm.css";

const WarningIcon: string = require("./common/Warning.svg").default;
interface InputFormProps {
  video: Video;
  setField1Prompt: React.Dispatch<
    React.SetStateAction<{ type: string | null } | null>
  >;
  setField2Prompt: React.Dispatch<
    React.SetStateAction<{ type: string | null } | null>
  >;
  setField3Prompt: React.Dispatch<
    React.SetStateAction<{ type: string | null } | null>
  >;
  field1: string;
  field2: string;
  field3: string;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  setShowVideoTitle: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCheckWarning: React.Dispatch<React.SetStateAction<boolean>>;
}

export function InputForm({
  video,
  setField1Prompt,
  setField2Prompt,
  setField3Prompt,
  field1,
  field2,
  field3,
  setIsSubmitted,
  setShowVideoTitle,
  setShowCheckWarning,
}: InputFormProps): JSX.Element {
  const queryClient = useQueryClient();

  const summaryRef = useRef<HTMLInputElement>(null);
  const chaptersRef = useRef<HTMLInputElement>(null);
  const highlightsRef = useRef<HTMLInputElement>(null);

  async function handleClick(
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    event.preventDefault();

    if (summaryRef.current?.checked) {
      setField1Prompt({ type: field1 });
    } else {
      setField1Prompt(null);
    }

    if (chaptersRef.current?.checked) {
      setField2Prompt({ type: field2 });
    } else {
      setField2Prompt(null);
    }

    if (highlightsRef.current?.checked) {
      setField3Prompt({ type: field3 });
    } else {
      setField3Prompt(null);
    }

    if (
      !summaryRef.current?.checked &&
      !chaptersRef.current?.checked &&
      !highlightsRef.current?.checked
    ) {
      setShowVideoTitle(false);
      setShowCheckWarning(true);
      return;
    }

    setIsSubmitted(true);
    setShowVideoTitle(true);
    setShowCheckWarning(false);

    queryClient.invalidateQueries({
      queryKey: [keys.VIDEOS, video._id, "summarize", "chapters", "highlights"],
    });
  }

  useEffect(() => {
    if (summaryRef.current) summaryRef.current.checked = true;
    if (chaptersRef.current) chaptersRef.current.checked = true;
    if (highlightsRef.current) highlightsRef.current.checked = true;
  }, []);

  return (
    <div className="inputForm">
      <div className="inputForm__title">Choose a summary format</div>
      <form className="inputForm__form">
        <div className="inputForm__form__checkboxes">
          <div className="inputForm__form__checkboxes__wrapper">
            <input
              className="inputForm__form__checkboxes__wrapper__checkbox"
              type="checkbox"
              data-cy="data-cy-checkbox-summary"
              id={field1}
              name={field1}
              ref={summaryRef}
            />
            <label
              className="inputForm__form__checkboxes__wrapper__label"
              htmlFor={field1}
            >
              {field1}
            </label>
          </div>
          <div className="inputForm__form__checkboxes__wrapper">
            <input
              className="inputForm__form__checkboxes__wrapper__checkbox"
              type="checkbox"
              ref={chaptersRef}
              data-cy="data-cy-checkbox-chapters"
              id={field2}
              name={field2}
            />
            <label
              className="inputForm__form__checkboxes__wrapper__label"
              htmlFor={field2}
            >
              {field2}s
            </label>
          </div>
          <div className="inputForm__form__checkboxes__wrapper">
            <input
              className="inputForm__form__checkboxes__wrapper__checkbox"
              type="checkbox"
              ref={highlightsRef}
              data-cy="data-cy-checkbox-highlights"
              id={field3}
              name={field3}
            />
            <label
              className="inputForm__form__checkboxes__wrapper__label"
              htmlFor={field3}
            >
              {field3}s
            </label>
          </div>
        </div>
        <button
          className="inputForm__form__button"
          data-cy="data-cy-generate-button"
          onClick={handleClick}
        >
          Generate
        </button>
      </form>
    </div>
  );
}
