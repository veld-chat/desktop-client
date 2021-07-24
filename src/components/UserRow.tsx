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
  HStack,
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
  return (
    <>
      <HStack w="full" align={children ? "start" : "center"} spacing="12">
        {showStatus ? (
          <UserAvatarWithStatus user={user} />
        ) : (
          <UserAvatar user={user} />
        )}
        <VStack w="full" lineHeight="16px" spacing="4" align="start">
          <Text as="span">
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
          {children}
        </VStack>
      </HStack>
    </>
  );
};