import { Module } from "vuex";
import { RootState } from "../../store";
import { User, UserTyping } from "../../models";

export interface UserState {
  users: readonly User[]
  usersById: { [id: string]: User },
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
    async add({ state, commit }, users: User[]) {
      console.log("current users", [...state.users].map(x => x.id));
      console.log("filtered current users", [...state.users.filter(u => users.findIndex(x => x.id == u.id) == -1)].map(x => x.id));
      console.log("added users", [...users].map(x => x.id));
      commit("setUsers", [
        ...state.users.filter(u => users.findIndex(x => x.id == u.id) == -1),
        ...users,
      ])
    },
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
    async remove({ state, commit }, userOrId: User | string) {
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
      const newUsers = payload.map(x => {
        const u = state.usersById[x.id];
        if (!u) {
          return x;
        }

        return {
          id: x.id || u.id,
          name: x.name || u.name,
          avatarUrl: x.avatarUrl || u.avatarUrl,
          isBot: x.isBot || u.isBot,
          status: x.status || u.status,
        };
      });

      const usersById = {};

      for (const user of newUsers) {
        usersById[user.id] = user;
      }

      state.users = Object.freeze(newUsers);
      state.usersById = Object.freeze(usersById);
    },

    setTyping(state, payload: UserTyping[]) {
      state.typing = payload;
    }
  }
};
