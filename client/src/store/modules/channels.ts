import { Module } from "vuex";
import { RootState } from "@/store";
import { Channel } from "@/models";

export interface UserState {
  channels: readonly Channel[]
  channelsById: { [id: string]: Channel },
}

export const users: Module<UserState, RootState> = {
  namespaced: true,

  state: {
    channels: [],
    channelsById: {},
  },

  getters: {
    byId: state => id => state.channelsById[id],
  },

  actions: {
    async clear({ commit }) {
      commit("setUsers", []);
    },
    async set({ commit }, channels: Channel[]) {
      commit("setUsers", channels);
    },
    async update({ state, commit }, channel: Channel) {
      commit("setUsers", [
        ...state.channels.filter(u => u.id !== channel.id),
        channel
      ]);
    },
    async remove({ state, commit }, channelOrId: Channel | string) {
      if (typeof channelOrId !== "string") {
        channelOrId = channelOrId.id;
      }

      commit("setUsers", [...state.channels.filter(u => u.id !== channelOrId)]);
    }
  },

  mutations: {
    setChannels(state, payload: Channel[]) {
      const channeldById = {};

      for (const user of payload) {
        channeldById[user.id] = user;
      }

      state.channels = Object.freeze(payload);
      state.channelsById = Object.freeze(channeldById);
    }
  }
};
