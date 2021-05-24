import { Editor } from "slate";
import { ChatEditor } from "../utils/ChatEditor";

export default {
  hotkey: "mod+b",
  exec: (editor: Editor) => {
    ChatEditor.toggleMark(editor, "bold");
  },
};
