import { commandManager } from "@/commands/command-manager";

commandManager.register({
  name: "nick",
  description: "Change your nickname",
  async handle({ args: [name], client }) {
    try {
      await client.setName(name);
    } catch (e) {
      client.error(e.message);
    }
  }
});