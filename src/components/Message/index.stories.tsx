import React from "react";
import { Meta } from "@storybook/react";

import { MessageRow } from ".";

export const Default = () => (
  <MessageRow message={{
    id: "0",
    author: {
        id: "0",
        name: "Author",
        badges: 0,
        isBot: false,
    },
    parts: [
        { 
            content: "Hello World!",
            reactions: [
                {
                    emoji: "👍",
                    count: 0,
                    me: false,
                }
            ],
            isMention: false,
            isEmojiOnly: false,
            id: "0",
        },
    ],
    timestamp: new Date(),
  }} />
);

export default {
  title: "Components/Message",
  component: MessageRow,
} as Meta;
