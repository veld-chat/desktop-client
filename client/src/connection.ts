import { Emoji, registerEmoji } from "@/utils/emoji";
import { store } from "@/store";
import { ServerEditMessage, ServerMessage, User } from "./models";
import proxyfetch from "./utils/proxyfetch";
import { mapToEmbed } from "./utils/embed-mapper";
import { client } from "./api-client";

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
  console.log("ready!");

  id = data.user.id;
  await store.dispatch("session/setUser", data.user);
  await store.dispatch("session/setToken", data.token);

  if (data.channels.length === 0) {
    const channel = await client().joinChannel("main");
    data.channels.push(channel);
  }
  await store.dispatch("channels/set", data.channels);
  await store.dispatch("channels/setCurrentChannel", data.channels[0].id);

  localStorage.setItem("token", data.token);
  console.log(`Logged in as ${data.user.name} (${data.user.id})`);
}

async function messageCreate(data) {
  if (data.embed == null) {
    const urls = urlRegex.exec(data.content);
    if (urls != null) {
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

  const host = localStorage.getItem("gateway") || "api.veld.chat";

  console.log("connecting to " + `wss://${host}`)
  websocket = new WebSocket(`wss://${host}`);
  websocket.onopen = (ev) => {
    isConnected = true;
    console.log("connected", ev);

    websocket.send(JSON.stringify({
      t: messageType.authorize,
      d: {
        token: localStorage.getItem("token"),
      }
    }));
  };

  websocket.onclose = (ev: CloseEvent) => {
    console.log("connection closed", ev.reason);
  }

  websocket.onmessage = async (ev) => {
    console.log(ev);
    const text = await ev.data;
    const payload = JSON.parse(text);
    console.log("payload received", payload);
    switch (payload.t) {
      case messageType.ready:
        ready(payload.d);
        break;
      case messageType.messageCreate:
        messageCreate(payload.d);
        break;
    }

    return false;
  };

  fetch(`//${host}/emojis`)
    .then(r => r.json())
    .then((r: Emoji[]) => r.forEach(registerEmoji));
  /*
 
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
}*/
}