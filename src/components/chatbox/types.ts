import { BaseEditor, Editor } from "slate";
import { ReactEditor } from "slate-react";

export type SlateElement = {
  type: "paragraph" | "code";
  children: SlateText[];
};

export type SlateText = {
  text: string;
  code?: boolean;
  bold?: boolean;
  italic?: boolean;
};

export interface IEditorAction {
  hotkey: string;
  exec: (editor: Editor) => void;
}

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: SlateElement;
    Text: SlateText;
  }
}
