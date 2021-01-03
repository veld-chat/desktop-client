import { Module } from "vuex";
import { RootState } from "../../store";
import { User } from "../../models";

export interface SessionState {
  user: string;
  token: string;
}

export const session: Module<SessionState, RootState> = {
  namespaced: true,

  state: {
    user: null,
    token: null
  },

  getters: {},

  actions: {
    async setUser({ commit }, user: string) {
      commit("setUser", user);
    },
    async setToken({ commit }, token: string) {
      commit("setToken", token);
    }
  },

  mutations: {
    setUser(state, user: string) {
      state.user = user;
    },
    setToken(state, token: string) {
      state.token = token;
    }
  }
};
