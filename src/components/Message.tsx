import React from "react";
import { Message } from "@/models";
import { UserRow } from "./UserRow";
import { Text } from "@chakra-ui/layout";
import { Box } from "@chakra-ui/react";

interface Props {
  message: Message;
}

export const MessageRow = ({ message }: Props) => (
  <Box my="2">
    <UserRow user={message.author}>
      {message.parts.map(p => (
        <Text
          fontSize="xs"
          fontWeight="normal"
          dangerouslySetInnerHTML={{ __html: p.content }}
        />
      ))}
    </UserRow>
  </Box>
);
