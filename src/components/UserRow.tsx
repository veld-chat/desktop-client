import { User } from "@/models";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack
} from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import { UserAvatar } from "./UserAvatar";
import { UserAvatarWithStatus } from "./UserAvatarWithStatus";

type Props = {
  user: User;
  showStatus?: boolean;
};

export const UserRow = ({
  user,
  children,
  showStatus
}: PropsWithChildren<Props>) => {
  return (
    <>
      <Popover placement="auto" isLazy lazyBehavior="unmount">
        <Flex w="full" align="center">
          {showStatus ? (
            <UserAvatarWithStatus user={user} size="sm" />
          ) : (
            <UserAvatar user={user} size="sm" />
          )}
          <Box w="full">
            <PopoverTrigger>
              <Text as="span">{user.name}</Text>
            </PopoverTrigger>
            {children}
          </Box>
        </Flex>
        <PopoverContent>
          <PopoverBody>
            <VStack align="stretch" spacing="4">
              <Flex align="center" justify="space-between">
                <Flex align="center">
                  <Avatar
                    mr="2"
                    size="sm"
                    src={`https://cdn.miki.bot/chat/avatars/${user.avatarUrl ||
                      Number(user.id) % 5}.png`}
                  />
                  {user.name}
                </Flex>
                <Button bg="red.500" size="sm">
                  Add as friend
                </Button>
              </Flex>
              <Text>This is a test status. Hello World!</Text>
              <Input size="sm" placeholder={`Message ${user.name}`} />
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
