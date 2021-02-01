import { Module } from "vuex";
import { RootState } from "../../store";
import { User } from "../../models";

export interface SessionState {
  userId: string;
  token: string;
}

export const session: Module<SessionState, RootState> = {
  namespaced: true,

  state: {
    userId: null,
    token: null
  },

  getters: {
    user: (state, getters, rootState) => rootState.users.usersById[state.userId],
  },

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
      state.userId = user;
    },
    setToken(state, token: string) {
      state.token = token;
    }
  }
};
