import React from "react";
import { Editor } from "slate";
import { ChatEditor } from "./utils/ChatEditor";

export interface Events {
  onSubmit(): void;
}

export const createInputHandler = (editor: Editor, events?: Events) => {
  return (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.ctrlKey) {
      return handleCtrlInput(event, editor, events);
    }

    if (event.shiftKey) {
      return handleShiftInput(event, editor, events);
    }

    if (event.key == "Enter") {
      event.preventDefault();
      events.onSubmit();
    }
  };
};

const handleCtrlInput = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  events?: Events
) => {
  switch (event.key) {
    case "b": {
      ChatEditor.toggleMark(editor, "bold");
      event.preventDefault();
      break;
    }

    case "i": {
      ChatEditor.toggleMark(editor, "italic");
      event.preventDefault();
      break;
    }

    case "`": {
      ChatEditor.toggleMark(editor, "code");
      event.preventDefault();
      break;
    }
  }
};

const handleShiftInput = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  events?: Events
) => {};
