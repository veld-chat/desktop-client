import { User } from "@/models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  users: User[];
  usersById: Record<string, User>;
  typing: Array<string>;
}

const initialState: UserState = {
  users: [],
  usersById: {},
  typing: []
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<User[]>) => {
      const users: User[] = [
        ...state.users.filter(u => users.findIndex(x => x.id == u.id) == -1),
        ...action.payload
      ];
      const usersById = {};

      for (const user of users) {
        usersById[user.id] = user;
      }

      return {
        users,
        usersById,
        typing: state.typing
      };
    },
    clear: () => {
      return initialState;
    },
    set: (state, users: PayloadAction<User[]>) => {
      const usersById = {};

      for (const user of users.payload) {
        usersById[user.id] = user;
      }

      return {
        users: users.payload,
        usersById,
        typing: state.typing
      };
    },
    update: (state, user: PayloadAction<User>) => {
      state.users = [
        ...state.users.filter(x => x.id !== user.payload.id),
        user.payload
      ];
      state.usersById[user.payload.id] = user.payload;
    },
    remove: (state, userOrId: PayloadAction<User | string>) => {
      if (typeof userOrId.payload !== "string") {
        userOrId.payload = userOrId.payload.id;
      }

      const users = [...state.users.filter(u => u.id !== userOrId.payload)];
      const usersById = {};
      for (const user of users) {
        usersById[user.id] = user;
      }

      return {
        users,
        usersById,
        typing: state.typing
      };
    },
    setTyping: (state, action: PayloadAction<string>) => {
      return Object.assign(state, {
        typing: [
          ...state.typing.filter(u => u !== action.payload),
          {
            id: action.payload,
            lastTypingTime: Date.now()
          }
        ]
      });
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  add,
  update,
  set,
  setTyping,
  remove,
  clear
} = usersSlice.actions;

export default usersSlice.reducer;
