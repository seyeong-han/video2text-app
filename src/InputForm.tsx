import React, { useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { keys } from "./common/keys";
import { Video } from "./common/types";
import "./InputForm.css";

const WarningIcon: string = require("./common/Warning.svg").default;
interface InputFormProps {
  video: Video;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
  field6: string;
  fieldTypes: Set<string>;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  setShowVideoTitle: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCheckWarning: React.Dispatch<React.SetStateAction<boolean>>;
}

export function InputForm({
  video,
  field1,
  field2,
  field3,
  field4,
  field5,
  field6,
  fieldTypes,
  setIsSubmitted,
  setShowVideoTitle,
  setShowCheckWarning,
}: InputFormProps): JSX.Element {
  const queryClient = useQueryClient();

  const topicRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const hashtagRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLInputElement>(null);
  const chaptersRef = useRef<HTMLInputElement>(null);
  const highlightsRef = useRef<HTMLInputElement>(null);

  async function handleClick(
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    event.preventDefault();

    if (topicRef.current?.checked) {
      fieldTypes.add(field1);
    } else {
      fieldTypes.delete(field1);
    }

    if (titleRef.current?.checked) {
      fieldTypes.add(field2);
    } else {
      fieldTypes.delete(field2);
    }

    if (hashtagRef.current?.checked) {
      fieldTypes.add(field3);
    } else {
      fieldTypes.delete(field3);
    }

    if (summaryRef.current?.checked) {
      fieldTypes.add(field4);
    } else {
      fieldTypes.delete(field4);
    }

    if (chaptersRef.current?.checked) {
      fieldTypes.add(field5);
    } else {
      fieldTypes.delete(field5);
    }

    if (highlightsRef.current?.checked) {
      fieldTypes.add(field6);
    } else {
      fieldTypes.delete(field6);
    }

    if (
      !topicRef.current?.checked &&
      !titleRef.current?.checked &&
      !hashtagRef.current?.checked &&
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
    queryClient.invalidateQueries({
      queryKey: [keys.VIDEOS, video._id, "gist"],
    });
  }

  useEffect(() => {
    if (topicRef.current) topicRef.current.checked = true;
    if (titleRef.current) titleRef.current.checked = true;
    if (hashtagRef.current) hashtagRef.current.checked = true;
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
              data-cy="data-cy-checkbox-topic"
              id={field1}
              name={field1}
              ref={topicRef}
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
              ref={titleRef}
              data-cy="data-cy-checkbox-title"
              id={field2}
              name={field2}
            />
            <label
              className="inputForm__form__checkboxes__wrapper__label"
              htmlFor={field2}
            >
              {field2}
            </label>
          </div>
          <div className="inputForm__form__checkboxes__wrapper">
            <input
              className="inputForm__form__checkboxes__wrapper__checkbox"
              type="checkbox"
              ref={hashtagRef}
              data-cy="data-cy-checkbox-hashtag"
              id={field3}
              name={field3}
            />
            <label
              className="inputForm__form__checkboxes__wrapper__label"
              htmlFor={field3}
            >
              {field3}
            </label>
          </div>
          <div>
            <input
              className="inputForm__form__checkboxes__wrapper__checkbox"
              type="checkbox"
              data-cy="data-cy-checkbox-summary"
              id={field4}
              name={field4}
              ref={summaryRef}
            />
            <label
              className="inputForm__form__checkboxes__wrapper__label"
              htmlFor={field4}
            >
              {field4}
            </label>
          </div>
          <div className="inputForm__form__checkboxes__wrapper">
            <input
              className="inputForm__form__checkboxes__wrapper__checkbox"
              type="checkbox"
              ref={chaptersRef}
              data-cy="data-cy-checkbox-chapters"
              id={field5}
              name={field5}
            />
            <label
              className="inputForm__form__checkboxes__wrapper__label"
              htmlFor={field5}
            >
              {field5}
            </label>
          </div>
          <div className="inputForm__form__checkboxes__wrapper">
            <input
              className="inputForm__form__checkboxes__wrapper__checkbox"
              type="checkbox"
              ref={highlightsRef}
              data-cy="data-cy-checkbox-highlights"
              id={field6}
              name={field6}
            />
            <label
              className="inputForm__form__checkboxes__wrapper__label"
              htmlFor={field6}
            >
              {field6}
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
