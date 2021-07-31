import { User, UserBadges, StatusType } from "../models";
import { hasFlag } from "../utils/flags";
import { Badge, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import { UserAvatar } from "./UserAvatar";
import { UserAvatarWithStatus } from "./UserAvatarWithStatus";
import { FaCheckCircle, FaHeart } from "react-icons/fa";
import formatRelative from "date-fns/formatRelative";
import capitalize from "lodash/capitalize";

type Props = {
  user: User;
  showStatus?: boolean;
  timestamp?: Date;
};

export const UserRow = ({
  user,
  children,
  showStatus,
  timestamp,
}: PropsWithChildren<Props>) => {
  return (
    <>
      <HStack
        w="full"
        opacity={
          showStatus && user?.status?.statusType == StatusType.Offline
            ? "0.4"
            : undefined
        }
        align={children ? "start" : "center"}
        spacing="12"
      >
        {showStatus ? (
          <UserAvatarWithStatus user={user} />
        ) : (
          <UserAvatar user={user} />
        )}
        <VStack w="full" spacing="4" align="start">
          <HStack spacing="6">
            <HStack spacing="2">
              <Text as="span" lineHeight={children ? "12px" : undefined}>
                {user.name}
              </Text>
              {hasFlag(user.badges, UserBadges.Admin) && (
                <Icon as={FaCheckCircle} ml="1" w="3" color="blue.500" />
              )}
              {hasFlag(user.badges, UserBadges.Supporter) && (
                <Icon as={FaHeart} ml="1" w="3" color="red.500" />
              )}
              {hasFlag(user.badges, UserBadges.Bot) && (
                <Badge bg="red.500" pt="px" color="white" ml="1">
                  Bot
                </Badge>
              )}
            </HStack>
            {timestamp && (
              <Text fontSize="paragraph.small" color="bright.40">
                {capitalize(formatRelative(new Date(timestamp), Date.now()))}
              </Text>
            )}
          </HStack>

          {children}
        </VStack>
      </HStack>
    </>
  );
};
