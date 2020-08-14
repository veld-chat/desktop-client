import { Client } from "../client/client";

const ws = /\s+/;

export interface CommandContext {
  args: string[];
  content: string;
  client: Client;
}

export interface CommandInformation {
  name: string;
  description: string;
}

export interface Command {
  name: string;
  description: string;
  handle(e: CommandContext): void | Promise<void>;
}

export const commandManager = new class {
  private _commands: { [name: string]: Command } = {};
  commands: { [name: string]: CommandInformation } = {}

  register(command: Command) {
    this._commands[command.name] = command;
    this.commands[command.name] = {
      name: command.name,
      description: command.description
    }
  }

  handle(client: Client, content: string) {
    if (!content || content[0] !== "/") {
      return false;
    }

    const args = content.substr(1).split(ws);
    const name = args.shift();
    const command = this._commands[name];

    if (!command) {
      return true;
    }

    command.handle({
      args,
      client,
      content
    })

    return true;
  }
}
