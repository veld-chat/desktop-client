import { commandManager } from "@/command-manager";

const nickRegex = /[A-Za-z0-9][A-Za-z0-9\-]{0,15}/;
const slashRegex = /-+/g

commandManager.register({
  name: "nick",
  description: "Change your nickname",
  async handle({ args: [nick], client }) {
    nick = nick.replace(slashRegex, '-');

    if (!nickRegex.test(nick)) {
      client.error("Your nickname is invalid; only letters, numbers or slashes are allowed.")
      return;
    }

    client.name = nick;
  }
});