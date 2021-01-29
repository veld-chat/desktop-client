import { Emoji, store } from "./store";
import proxyfetch from "./utils/proxyfetch";
import { mapToEmbed } from "./utils/embed-mapper";
import { client } from "./api-client";
import { createLogger } from "./services/logger";
import { StatusType, User } from "./models";
import emojis from "./base-emojis.json";
import { base } from "twemoji";

const logger = createLogger("WebSocket");
export let websocket: WebSocket;

let heartbeatInterval = null;
let isConnected = false;
const urlRegex = /((http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?)/;
let id = "";

interface WebSocketPayload {
  t: MessageType;
  d: unknown;
}

function emojiUnicode(emoji) {
  let comp: any;
  if (emoji.length === 1) {
    comp = emoji.charCodeAt(0);
  }
  comp = (
    (emoji.charCodeAt(0) - 0xD800) * 0x400
    + (emoji.charCodeAt(1) - 0xDC00) + 0x10000
  );
  if (comp < 0) {
    comp = emoji.charCodeAt(0);
  }
  return comp.toString("16");
}

enum MessageType {
  Authorize = 0,
  Ready = 1,
  MessageCreate = 2,
  MessageUpdate = 3,
  MessageDelete = 4,
  UserUpdate = 8,
  MemberCreate = 9,
  MemberDelete = 11,
  PresenceUpdate = 12,
  Heartbeat = 1000,
  HeartbeatAck = 1001,
}

async function ready(data) {
  id = data.user.id;
  await store.dispatch("session/setUser", data.user.id);
  await store.dispatch("session/setToken", data.token);

  if (data.channels.length === 0) {
    const channel = await client().joinChannel("main");
    data.channels.push(channel);
  }
  await store.dispatch("channels/set", data.channels);
  await store.dispatch("channels/setCurrentChannel", data.channels[0].id);

  await store.dispatch("users/add", data.users.map(x => ({
    ...x,
    status: {
      statusText: null,
      statusType: StatusType.Online,
    }
  })))

  localStorage.setItem("token", data.token);
  heartbeatInterval = setInterval(heartbeat, 15000);

  console.log(`Logged in as ${data.user.name} (${data.user.id})`);
}

async function memberCreate(data) {
  await store.dispatch("users/update", data);
  await store.dispatch("channels/addMember", data);
}

async function memberDelete(data) {
  await store.dispatch("users/remove", data);
  await store.dispatch("channels/removeMember", data);
}

async function messageCreate(data) {
  if (data.embed == null) {
    const urls = urlRegex.exec(data.content);
    if (urls != null) {
      const res = await proxyfetch(urls[0]);
      data.embed = await mapToEmbed(res);
    }
  }
  await store.dispatch("messages/create", data);
}

async function presenceUpdate(data) {
  const user = data.user as User;
  user.status = {
    statusType: data.statusType,
    statusText: data.statusText,
  };

  await store.dispatch("users/update", user);
}

async function userUpdate(data) {
  if (id == data.id) {
    await store.dispatch("session/setUser", data);
  }
  await store.dispatch("users/update", data);
}

async function heartbeat() {
  logger.log("sending heartbeat");
  websocket.send(JSON.stringify({
    t: MessageType.Heartbeat,
    d: null,
  }))
}

export function connect() {
  if (isConnected) {
    return;
  }

  const host = localStorage.getItem("gateway") || "api.veld.chat";

  const baseEmojis = Object.keys(emojis).map((x) => ({
    name: x.split("_").map(x => x[0].toUpperCase() + x.substr(1)).join(" "),
    value: `:${x}:`,
    image: `https://twemoji.maxcdn.com/v/13.0.1/72x72/${emojiUnicode(emojis[x])}.png`,
  } as Emoji))

  store.dispatch("emoji/set", baseEmojis);

  logger.log("connecting to", `wss://${host}`)
  websocket = new WebSocket(`wss://${host}`);

  websocket.onopen = () => {
    isConnected = true;

    websocket.send(JSON.stringify({
      t: MessageType.Authorize,
      d: {
        token: localStorage.getItem("token"),
      }
    }));
  };

  websocket.onerror = (ev) => {
    logger.log("error", ev);
  }

  websocket.onclose = () => {
    logger.log("closed");

    clearInterval(heartbeatInterval);
    isConnected = false;
    connect();
  };

  websocket.onmessage = async (ev) => {
    const payload = JSON.parse(ev.data) as WebSocketPayload;
    logger.log(`received payload ${MessageType[payload.t] || "Unknown"}`, payload.d)

    switch (payload.t) {
      case MessageType.Ready:
        ready(payload.d);
        break;
      case MessageType.MessageCreate:
        messageCreate(payload.d);
        break;
      case MessageType.UserUpdate:
        userUpdate(payload.d);
        break;
      case MessageType.MemberCreate:
        memberCreate(payload.d);
        break;
      case MessageType.MemberDelete:
        memberDelete(payload.d);
        break;
      case MessageType.PresenceUpdate:
        presenceUpdate(payload.d);
        break;
    }
    return false;
  };
}



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
