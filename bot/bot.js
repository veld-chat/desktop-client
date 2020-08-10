const socketClient = require("socket.io-client");

const connection = socketClient("https://chat-gateway.veld.dev/");
connection.on('connect', () => {
  connection.emit("login", {
    name: "veld-bot"
  })
});

connection.on("sys-join", (user) => {
  connection.emit('usr-msg', {
    message: "welcome " + user.name + "!"
  });
})

connection.on("sys-leave", (user) => {
  connection.emit('usr-msg', {
    message: "bye " + user.name + " :sob:"
  });
})

connection.on('usr-msg', (message) => {
  console.log(message);

  if (message.message == "!ping") {
    connection.emit('usr-msg', {
      message: "pong!"
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
});