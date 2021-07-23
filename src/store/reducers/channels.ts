import { Channel, ScrollPosition } from "../../models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChannelsState {
  channels: Channel[];
  channelsById: { [key: string]: Channel };
  currentChannel: string;
}

const initialState = {
  channels: [],
  channelsById: {},
  currentChannel: null,
};

const setChannels = (channels) => {
  const channeldById = {};

  for (const channel of channels) {
    if (!channel) {
      continue;
    }

    channeldById[channel.id] = {
      ...channel,
      scroll: "end",
      unreadAmount: channel.unreadAmount || 0,
      mentionAmount: channel.mentionAmount || 0,
      members: [],
    } as Channel;
  }

  return {
    channels: Object.values(channeldById),
    channelsById: channeldById,
  };
};

export const channelSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    addMember: (
      state,
      payload: PayloadAction<{ id: string; member: string }>
    ) => {
      if (!state.channelsById[payload.payload.id]) {
        return;
      }

      state.channelsById[payload.payload.id].members.push(
        payload.payload.member
      );

      return {
        ...state,
      };
    },
    clear: (state) => {
      return Object.assign(state, {
        ...setChannels([]),
      }) as ChannelsState;
    },
    set: (state, channels: PayloadAction<Channel[]>) => {
      return Object.assign(state, {
        ...setChannels(channels.payload),
      }) as ChannelsState;
    },
    setCurrentChannel: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        currentChannel: action.payload,
      };
    },
    update: (state, channel: PayloadAction<Channel>) => {
      return Object.assign(state, {
        ...setChannels([
          channel,
          ...state.channels.filter((u) => u.id != channel.payload.id),
        ]),
      }) as ChannelsState;
    },
    remove: (state, channelOrId: PayloadAction<Channel | string>) => {
      if (typeof channelOrId.payload !== "string") {
        channelOrId.payload = channelOrId.payload.id;
      }

      if (state.currentChannel == channelOrId.payload) {
        state.currentChannel = "1";
      }

      return Object.assign(state, {
        currentChannel:
          state.currentChannel == channelOrId.payload
            ? "1"
            : state.currentChannel,
      }) as ChannelsState;
    },
    removeMember: (
      state,
      payload: PayloadAction<{ id: string; member: string }>
    ) => {
      if (!state.channelsById[payload.payload.id]) {
        return;
      }

      state.channelsById[payload.payload.id].members = state.channelsById[
        payload.payload.id
      ].members.filter((x) => x == payload.payload.member);
    },
    setScroll: (
      state,
      action: PayloadAction<{
        id: string;
        scroll: ScrollPosition;
      }>
    ) => {
      const channel = state.channels.find((x) => x.id == action.payload.id);
      channel.scroll = action.payload.scroll;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setScroll,
  removeMember,
  addMember,
  set,
  setCurrentChannel,
  remove,
  update,
  clear,
} = channelSlice.actions;

export default channelSlice.reducer;
