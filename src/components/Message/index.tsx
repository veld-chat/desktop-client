import React from "react";
import { Message } from "../../models";
import { UserRow } from "../UserRow";
import { Text } from "@chakra-ui/layout";
import { Embed } from "../Embed";
import { replaceEmojis } from "../../utils/emoji";
import { Badge, HStack } from "@chakra-ui/react";

interface Props {
  message: Message;
}

export const MessageRow = ({ message }: Props) => (
  <>
    <UserRow user={message.author}>
      {message.parts.map((p) => (
        <>
          {p.content && (
            <Text
              mb="px"
              fontSize={p.isEmojiOnly ? "paragraph.large" : "paragraph.small"}
              fontWeight="normal"
              dangerouslySetInnerHTML={{ __html: replaceEmojis(p.content) }}
            />
          )}
          {p.embed && <Embed value={p.embed} />}
          {p.reactions?.length > 0 && (
            <HStack>
              {p.reactions.map(r => (
                <Badge>
                  {replaceEmojis(r.emoji)} {r.count}
                </Badge>
              ))}
            </HStack>
          )}
        </>
      ))}
    </UserRow>
  </>
);
