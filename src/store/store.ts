import { configureStore } from "@reduxjs/toolkit";
import messages from "./reducers/messages";
import emojis from "./reducers/emojis";
import channels from "./reducers/channels";
import sessions from "./reducers/session";
import users from "./reducers/users";

export default configureStore({
  reducer: {
    messages,
    emojis,
    channels,
    sessions,
    users
  }
});
