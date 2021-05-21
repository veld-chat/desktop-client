import { Message, ServerMessage } from "@/models";
import { processMessage } from "../../utils/string";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MessagesState {
  messagesByChannel: { [id: string]: Message[] };
  lastMessageRead: { [id: string]: string };
}

interface ReadMessageAction {
  messageId: string;
  channelId: string;
}

const initialState: MessagesState = {
  messagesByChannel: {},
  lastMessageRead: {}
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    create: (state, action: PayloadAction<ServerMessage>) => {
      const part = processMessage(action.payload, false);
      let messages = state.messagesByChannel[action.payload.channelId];
      if (!messages) {
        state.messagesByChannel[action.payload.channelId] = [];
        messages = state.messagesByChannel[action.payload.channelId];
      }

      const data: Message = {
        author: action.payload.author,
        id: action.payload.id,
        timestamp: action.payload.timestamp,
        parts: [part]
      };

      messages.push(data);
    },
    read: (state, action: PayloadAction<ReadMessageAction>) => {
      console.log("read");
      state.lastMessageRead[action.payload.channelId] =
        action.payload.messageId;
    }
  }
});

// Action creators are generated for each case reducer function
export const { read, create } = messageSlice.actions;

export default messageSlice.reducer;
