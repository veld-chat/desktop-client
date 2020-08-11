import { commandManager } from "@/commands/command-manager";

const nickRegex = /^[A-Za-z0-9][A-Za-z0-9\-]{0,15}$/;
const slashRegex = /-+/g

commandManager.register({
  name: "nick",
  description: "Change your nickname",
  async handle({ args: [name], client }) {
    name = name.replace(slashRegex, '-');

    if (!nickRegex.test(name)) {
      client.error("Your nickname is invalid; only letters, numbers or slashes are allowed with a max length of 16.")
      return;
    }

    await client.setName(name);
  }
});