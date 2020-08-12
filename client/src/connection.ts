import { Emoji, registerEmoji } from "@/utils/emoji";
import io from "socket.io-client";
import { store } from "@/store";
import { ServerMessage } from "@/models";

export let connection: SocketIOClient.Socket;

export function connect() {
  const host = localStorage.getItem("gateway") || "chat-gateway.veld.dev";

  connection = io(host);

  fetch(`//${host}/api/v1/emoji`)
    .then(r => r.json())
    .then((r: Emoji[]) => r.forEach(registerEmoji));

  connection.on("ready", async (options) => {
    await store.dispatch("session/setUser", options.user);
    await store.dispatch("session/setToken", options.token);
    await store.dispatch("users/set", options.members);

    console.log(`Logged in as ${options.user.name} (${options.user.id})`);
  });

  connection.on("sys-join", (user) => store.dispatch("users/update", user));
  connection.on("user-edit", (user) => store.dispatch("users/update", user));
  connection.on("sys-leave", (user) => store.dispatch("users/remove", user.id));

  connection.on("usr-typ", (user) => store.dispatch("users/setTyping", user.id));
  connection.on("usr-msg", (message) => store.dispatch("messages/add", message));
  connection.on("sys-error", (e) => store.dispatch("messages/add", {
    user: "system",
    mentions: [],
    content: e.content
  } as ServerMessage));

  connection.on("connect", () => {
    connection.emit("login", {
      token: localStorage.getItem("token") || null
    });
  });
}
