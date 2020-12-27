import { Emoji, registerEmoji } from "@/utils/emoji";
import { store } from "@/store";
import { ServerEditMessage, ServerMessage, User } from "@/models";
import proxyfetch from "./utils/proxyfetch";
import { mapToEmbed } from "./utils/embed-mapper";
import { encode, decode } from "msgpack-lite";

export let websocket: WebSocket;
let isConnected = false;
const urlRegex = /((http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?)/;
let id = "";

const messageType = {
  authorize: 0,
  ready: 1,
  messageCreate: 2,
  messageUpdate: 3,
  messageDelete: 4,
}

async function ready(data) {
  id = data.user.id;
  await store.dispatch("session/setUser", data.user);
  await store.dispatch("session/setToken", data.token);
}

async function messageCreate(data) {
  if(data.embed == null) {
    const urls = urlRegex.exec(data.content);
    if(urls != null) {
      const res = await proxyfetch(urls[0]);
      console.log(res);
      data.embed = await mapToEmbed(res);
    }
  }
  await store.dispatch("channels/addMessage", data);
}

export function connect() {
  if (isConnected) {
    return;
  }

  isConnected = true;

  const host = localStorage.getItem("gateway") || "wss://chat-gateway.veld.dev";

  websocket = new WebSocket(host);

  websocket.onopen = (ev) => {
    console.log("connected", ev);

    websocket.send(encode({
      t: 0,
      d: {
        token: localStorage.get("token"),
      }
    }));
  };

  websocket.onmessage = async (ev) => {
    const payload = decode(ev.data);
    switch(payload.t) {
      case messageType.ready: await ready(payload.d);
      case messageType.messageCreate: await messageCreate(payload.d);
  }

  fetch(`//${host}/api/v1/emojis`)
    .then(r => r.json())
    .then((r: Emoji[]) => r.forEach(registerEmoji));

  /*connection.on("ready", async (options) => {
    id = options.user.id;
    await store.dispatch("session/setUser", options.user);
    await store.dispatch("session/setToken", options.token);
    await store.dispatch("users/set", options.members);
    await store.dispatch("channels/set", options.channels.map(c => ({
      ...c,
      members: c.members.map(e => e.id)
    })));
    await store.dispatch("channels/setCurrentChannel", options.mainChannel);

    localStorage.setItem("token", options.token);

    console.log(`Logged in as ${options.user.name} (${options.user.id})`);
  });

  connection.on("member:create", (memberJoinEvent) => {
    store.dispatch("channels/addMember", {
      id: memberJoinEvent.channel.id,
      member: memberJoinEvent.user.id,
    });
  });

  connection.on("member:delete", (memberJoinEvent) => {
    store.dispatch("channels/removeMember", {
      id: memberJoinEvent.channel.id,
      member: memberJoinEvent.user.id,
    });
  });

  connection.on("channel:create", (channel) => store.dispatch("channels/update", channel));
  connection.on("user:update", (user) => {
    store.dispatch("users/update", user);
    store.dispatch("session/setUser", user);
  });

  connection.on("user:join", (user) => store.dispatch("users/update", user));
  connection.on("user:leave", (user: User) => {
    if (store.state.channels.channels.some(c => c.members.includes(user.id))) {
      return store.dispatch("users/update", user);
    } else {
      return store.dispatch("users/remove", user)
    }
  });

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

  connection.on("message:create", async (message: ServerMessage) => {
    if(message.embed == null) {
      const urls = urlRegex.exec(message.content);
      if(urls != null) {
        const res = await proxyfetch(urls[0]);
        console.log(res);
        message.embed = await mapToEmbed(res);
      }
    }
    store.dispatch("channels/addMessage", message)
  });

  connection.on("message:update", async (editMessage: ServerEditMessage) => {
    // Update message content at frontend, and append edited + edited timestamp
  });

  connection.on("message:delete", async (editMessage: ServerEditMessage) => {
    // Delete message content at frontend
  });

  connection.on("sys-error",
    (e) => store.dispatch("channels/addMessage", {
      user: "system",
      mentions: [],
      content: e.content,
      channelId: store.state.channels.currentChannel,
    } as ServerMessage));

  connection.on("connect", () => {
    connection.emit("login", {
      token: localStorage.getItem("token") || null
    });
  });*/
  }
} 