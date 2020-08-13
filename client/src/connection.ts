import { Emoji, registerEmoji } from "@/utils/emoji";
import io from "socket.io-client";
import { store } from "@/store";
import { ServerMessage } from "@/models";

export let connection: SocketIOClient.Socket;

export function connect() {
  const host = localStorage.getItem("gateway") || "chat-gateway.veld.dev";
  let id = "";

  connection = io(host);

  fetch(`//${host}/api/v1/emojis`)
    .then(r => r.json())
    .then((r: Emoji[]) => r.forEach(registerEmoji));

  connection.on("ready", async (options) => {
    id = options.user.id;
    await store.dispatch("session/setUser", options.user);
    await store.dispatch("session/setToken", options.token);
    await store.dispatch("users/set", options.members);
    await store.dispatch("channels/set", options.channels);

    localStorage.setItem("token", options.token);

    console.log(`Logged in as ${options.user.name} (${options.user.id})`);
  });

  connection.on("member:create", (memberJoinEvent) => {
    store.dispatch("users/update", memberJoinEvent.user);
    store.dispatch("channels/addMember", {
      id: memberJoinEvent.channel.id,
      member: memberJoinEvent.user,
    });
  });

  connection.on("member:delete", (memberJoinEvent) => {
    store.dispatch("channels/removeMember", {
      id: memberJoinEvent.channel.id,
      member: memberJoinEvent.user.id,
    });
  });

  connection.on("channel:create", (channelEvent) => {
    store.dispatch("users/update", channelEvent.user);
    store.dispatch("channels/update", channelEvent.channel);
  });

  connection.on("user:update", (user) => store.dispatch("users/update", user));

  connection.on("channel:delete", (channelEvent) => {
    if (channelEvent.user.id == id) {
      store.dispatch("channels/remove", channelEvent.channel.id);
      store.dispatch("messages/removeChannel", channelEvent.channel.id);
    } else {
      store.dispatch("channels/update", channelEvent.channel);
    }
    store.dispatch("users/remove", channelEvent.user.id);
  });

  connection.on("user:typing", (user) => store.dispatch("users/setTyping", user.id));

  connection.on("message:create", (message) => {
    console.log(message);
    store.dispatch("messages/add", message)
  });

  connection.on("sys-error",
    (e) => store.dispatch("messages/add", {
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
