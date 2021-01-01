import { isEmojiOnly, replaceEmojis } from "@/utils/emoji";
import DOMPurify from "dompurify";
import marked from "marked";
import { Embed, MessagePart, ServerMessage } from "@/models";
import hljs from "highlight.js";
import { createLogger } from "../services/logger";

if (process.isClient) {
  hljs.initHighlightingOnLoad();
}

const logger = createLogger("StringTransformations");

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
        gfm: true,
        headerIds: false,
        breaks: true,
        highlight: (code, lang) => {
          if (!lang) {
            return code;
          }
          const value = hljs.highlight(lang, code).value;
          logger.log("Trying to highlight for", lang, value);
          return value;
        }
      }),
      {
        ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "br", "p", "code", "span", "pre"],
        ALLOWED_ATTR: ["href", "class"],
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
