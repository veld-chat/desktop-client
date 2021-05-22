import React from "react";
import { Message } from "../models";
import { UserRow } from "./UserRow";
import { Text } from "@chakra-ui/layout";
import { Box } from "@chakra-ui/react";
import { Embed } from "./Embed";
import { replaceEmojis } from "../utils/emoji";

interface Props {
  message: Message;
}

export const MessageRow = ({ message }: Props) => (
  <Box my="2">
    <UserRow user={message.author}>
      {message.parts.map((p) => (
        <>
          {p.content && (
            <Text
              mb="px"
              fontSize={p.isEmojiOnly ? "lg" : "xs"}
              fontWeight="normal"
              dangerouslySetInnerHTML={{ __html: replaceEmojis(p.content) }}
            />
          )}
          {p.embed && <Embed value={p.embed} />}
        </>
      ))}
    </UserRow>
  </Box>
);
