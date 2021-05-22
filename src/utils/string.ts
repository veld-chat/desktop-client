import DOMPurify from "dompurify";
import marked from "marked";
import { Embed, MessagePart, ServerMessage } from "../models";
import hljs from "highlight.js";
import { isEmojiOnly } from "./emoji";

if (typeof window !== "undefined") {
  hljs.initHighlightingOnLoad();
}

export function processMessage(
  message: ServerMessage,
  isMention: boolean
): MessagePart {
  const content = processString(message.content);

  console.log(message.content, isEmojiOnly(message.content));

  return {
    id: message.id,
    isMention,
    content,
    embed: processEmbed(message.embed),
    isEmojiOnly: isEmojiOnly(message.content),
  };
}

export function processString(input: string) {
  if (!input || input.length == 0) {
    return input;
  }

  return DOMPurify.sanitize(
    marked(input, {
      gfm: true,
      headerIds: false,
      breaks: true,
      highlight: (code, lang) => {
        if (!lang) {
          return code;
        }
        const value = hljs.highlight(lang, code).value;
        return value;
      },
    }),
    {
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
      ALLOWED_ATTR: ["href", "class"],
    }
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
