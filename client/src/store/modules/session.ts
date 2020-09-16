import { Module } from "vuex";
import { RootState } from "@/store";
import { User } from "@/models";

export interface SessionState {
  user: User;
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
    async setUser({ state, commit }, user: User) {
      console.log(user);
      console.log(state.user);
      if(state.user && state.user.id != user.id) {
        return;
      }  
      commit("setUser", user);
    },
    async setToken({ commit }, token: string) {
      commit("setToken", token);
    }
  },

  mutations: {
    setUser(state, user: User) {
      state.user = user;
    },
    setToken(state, token: string) {
      state.token = token;
    }
  }
};
