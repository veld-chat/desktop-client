import { Editor } from "slate";

export type MarkType = "bold" | "code" | "italic";

export const ChatEditor = {
  isMarkActive: (editor: Editor, format: MarkType) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  },
  toggleMark: (editor: Editor, format: MarkType) => {
    const isActive = ChatEditor.isMarkActive(editor, format);

    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  },
};
