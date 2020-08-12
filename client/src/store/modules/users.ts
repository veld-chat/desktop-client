import { Module } from "vuex";
import { RootState } from "@/store";
import { User, UserTyping } from "@/models";

export interface UserState {
  users: readonly User[]
  usersById: {[id: string]: User},
  typing: UserTyping[]
}

export const users: Module<UserState, RootState> = {
  namespaced: true,

  state: {
    users: [],
    usersById: {},
    typing: []
  },

  getters: {
    byId: state => id => state.usersById[id],
  },

  actions: {
    async clear({ commit }) {
      commit("setUsers", []);
    },
    async set({ commit }, users: User[]) {
      commit("setUsers", users);
    },
    async update({ state, commit }, user: User) {
      commit("setUsers", [
        ...state.users.filter(u => u.id !== user.id),
        user
      ]);
    },
    async remove({ state, commit }, userOrId: User|string) {
      if (typeof userOrId !== "string") {
        userOrId = userOrId.id;
      }

      commit("setUsers", [...state.users.filter(u => u.id !== userOrId)]);
    },
    async setTyping({ state, commit }, id: string) {
      commit("setTyping", [
        ...state.typing.filter(u => u.id !== id),
        {
          id,
          lastTypingTime: Date.now()
        }
      ]);
    },
  },

  mutations: {
    setUsers(state, payload: User[]) {
      const usersById = {};

      for (const user of payload) {
        usersById[user.id] = user;
      }

      state.users = Object.freeze(payload);
      state.usersById = Object.freeze(usersById);
    },
    setTyping(state, payload: UserTyping[]) {
      state.typing = payload;
    }
  }
};
