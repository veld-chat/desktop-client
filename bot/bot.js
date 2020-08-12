const socketClient = require("socket.io-client");

const connection = socketClient(process.env.DEV ? "http://localhost:1234" : "https://chat-gateway.veld.dev/");
console.log(`starting in ${process.env.DEV ? "dev" : "prod"} mode`);

const members = {};
let currentUser = null;

connection.on('connect', () => {
  console.log("connected to gateway");
  connection.emit("login", { token: null, bot: true })
});

connection.on('ready', (info) => {
  console.log(info);

  currentUser = info.user;
  for (let m of info.members) {
    members[m.id] = m;
  }

  connection.emit("usr-msg", {
    message: "/nick BOT-miki"
  });
});

connection.on("sys-join", (user) => {
  if (!currentUser) {
    return;
  }

  if (user.id == currentUser.id) {
    return;
  }

  connection.emit('usr-msg', {
    message: "welcome " + user.name + "!"
  });
  members[user.id] = user;
})

connection.on("sys-leave", (user) => {
  connection.emit('usr-msg', {
    message: "bye " + user.name + " :sob:"
  });
  delete members[user.id];
})

connection.on('usr-msg', (message) => {
  if (!message.message || message.bot) {
    return;
  }

  if (message.message == "!ping") {
    connection.emit('usr-msg', {
      embed: {
        description: "pong!",
        thumbnailUrl: "https://cdn.miki.ai/ext/imgh/1cigCtNNeb.gif"
      }
    });
  }
  if (message.message.startsWith("!say")) {
    let toSay = message.message.substring(4);
    console.log(toSay);

    connection.emit('usr-msg', {
      message: toSay
    });
  }

  if (message.message == "!help") {
    connection.emit('usr-msg', {
      message: "!help\n!say <message>\n!ping"
    });
  }

  if (message.message.startsWith("!remind")) {
    connection.emit('usr-msg', {
      message: "haha... no. I am too lazy to write this."
    });
  }
});