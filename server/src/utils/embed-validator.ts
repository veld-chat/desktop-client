import { EmbedPayload } from "@/models/embed";
import { validate } from "./string-validator";

const proxyUrl = "https://proxy.veld.workers.dev/?url=";

export const validateEmbed = (embed: EmbedPayload) => {
  if (!embed) {
    return embed;
  }

  if (embed.author) {
    if (!embed.author.value) {
      embed.author = null;
    } else {
      embed.author.value = validate(embed.author.value);
    }

    if (embed.author.iconUrl) {
      embed.imageUrl = proxyUrl + embed.author.iconUrl;
    }
  }

  if (embed.title) {
    embed.title = validate(embed.title);
  }

  if (embed.description) {
    embed.description = validate(embed.description);
  }

  if (embed.footer) {
    embed.footer = validate(embed.footer);
  }

  if (embed.imageUrl) {
    embed.imageUrl = proxyUrl + embed.imageUrl;
  }

  if (embed.thumbnailUrl) {
    embed.thumbnailUrl = proxyUrl + embed.thumbnailUrl;
  }

  return embed;
};