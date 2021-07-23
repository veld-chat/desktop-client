import React from "react";
import { Meta } from "@storybook/react";

import { Embed } from ".";

export const Default = () => (
  <Embed
    value={{
      author: {
        value: "Author String",
        iconUrl: "https://cdn.miki.bot/chat/avatars/2.png",
      },
      title: "This is a test embed",
      description:
        "Embed Description. This is a longer paragraph of text that contains some useful content. This is another paragraph which also does not contain anything of use.",
      imageUrl: "https://cdn.miki.bot/chat/avatars/2.png",
      footer: "This is a cool field with a little bit more content",
      thumbnailUrl: "https://cdn.miki.bot/chat/avatars/2.png",
    }}
  />
);

export default {
  title: "Components/Embed",
  component: Embed,
} as Meta;
