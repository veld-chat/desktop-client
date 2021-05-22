import { User, UserBadges } from "../models";
import { hasFlag } from "../utils/flags";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import { UserAvatar } from "./UserAvatar";
import { UserAvatarWithStatus } from "./UserAvatarWithStatus";
import {
  FaCheck,
  FaCheckCircle,
  FaCheckSquare,
  FaCrown,
  FaHeart,
  FaRegCheckSquare,
} from "react-icons/fa";

type Props = {
  user: User;
  showStatus?: boolean;
};

export const UserRow = ({
  user,
  children,
  showStatus,
}: PropsWithChildren<Props>) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex w="full" align={children ? "flex-start" : "flex-end"}>
        {showStatus ? (
          <UserAvatarWithStatus user={user} size="sm" />
        ) : (
          <UserAvatar user={user} size="sm" />
        )}
        <Box w="full">
          <Box>
            <Text align="center" as="span" onClick={onOpen}>
              {user.name}
              {hasFlag(user.badges, UserBadges.Admin) && (
                <Icon
                  as={FaCheckCircle}
                  ml="1"
                  w="3"
                  mb="2px"
                  color="blue.500"
                />
              )}
              {hasFlag(user.badges, UserBadges.Supporter) && (
                <Icon as={FaHeart} ml="1" w="3" mb="2px" color="red.500" />
              )}
              {hasFlag(user.badges, UserBadges.Bot) && (
                <Badge bg="red.500" pt="px" color="white" ml="1">
                  Bot
                </Badge>
              )}
            </Text>
          </Box>
          {children}
        </Box>
      </Flex>
      <Popover
        preventOverflow
        placement="right"
        isOpen={isOpen}
        onClose={onClose}
        closeOnEsc
        isLazy
      >
        <PopoverContent m="2">
          <PopoverBody>
            <VStack align="stretch" spacing="4">
              <Flex align="center" justify="space-between">
                <Flex align="center">
                  <Avatar
                    mr="2"
                    size="sm"
                    src={`https://cdn.miki.bot/chat/avatars/${
                      user.avatarUrl || Number(user.id) % 5
                    }.png`}
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
