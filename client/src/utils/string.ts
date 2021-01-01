import { isEmojiOnly, replaceEmojis } from "@/utils/emoji";
import DOMPurify from "dompurify";
import marked from "marked";
import { Embed, MessagePart, ServerMessage } from "@/models";

export function processMessage(message: ServerMessage, isMention: boolean): MessagePart {
  const content = processString(message.content);

  return {
    id: message.id,
    isMention,
    content,
    embed: processEmbed(message.embed),
    isEmojiOnly: isEmojiOnly(content)
  };
}

export function processString(input: string) {
  return replaceEmojis(
    DOMPurify.sanitize(
      marked(input, {
        sanitize: true,
        gfm: true,
        headerIds: false,
        breaks: true,
      }),
      {
        ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "br", "p", "code", "span", "pre"],
        ALLOWED_ATTR: ["href"],
      }
    )
  );
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
