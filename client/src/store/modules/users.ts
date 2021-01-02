import { Module } from "vuex";
import { RootState } from "../../store";
import { PresenceUpdateArgs, User, UserTyping } from "../../models";

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
      commit("setUsers", [
        ...state.users.filter(u => {
          const u2 = users.find(x => x.id !== u.id);
          console.log(u2);
          return u2;
        }),
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
    async setStatus({ state, commit }, args: PresenceUpdateArgs) {
      const user = state.usersById[args.userId];
      if (!user) {
        return;
      }

      user.status = {
        value: args.statusType,
        statusText: args.statusText,
      };

      commit("setUsers", [
        ...state.users.filter(u => u.id !== args.userId),
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
