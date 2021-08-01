import DOMPurify from "dompurify";
import { Embed, MessagePart, ServerMessage } from "../models";
import { isEmojiOnly } from "./emoji";
import markdown from "./markdown-parser";

export function processMessage(
  message: ServerMessage,
  isMention: boolean
): MessagePart {
  const content = processString(message.content);

  return {
    id: message.id,
    isMention,
    content,
    embed: processEmbed(message.embed),
    isEmojiOnly: isEmojiOnly(message.content),
    reactions: message.reactions,
  };
}

export function processString(input: string) {
  if (!input || input.length == 0) {
    return input;
  }

  return DOMPurify.sanitize(markdown.parseInline(input), {
    ALLOWED_TAGS: [
      "b",
      "i",
      "ul",
      "li",
      "em",
      "strong",
      "a",
      "br",
      "p",
      "code",
      "span",
      "pre",
    ],
    ALLOWED_ATTR: ["href", "target", "class"],
  });
}

export function processEmbed(embed: Embed): Embed {
  if (!embed) {
    return embed;
  }

  if (embed.author) {
    if (!embed.author.value) {
      embed.author = null;
    } else {
      embed.author.value = processString(embed.author.value);
    }
  }

  if (embed.title) {
    embed.title = processString(embed.title);
  }

  if (embed.description) {
    embed.description = processString(embed.description);
  }

  if (embed.footer) {
    embed.footer = processString(embed.footer);
  }

  return embed;
}
