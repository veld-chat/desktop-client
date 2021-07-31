import {
  Avatar,
  AvatarBadge,
  AvatarProps,
  Box,
  ComponentWithAs,
  Icon,
} from "@chakra-ui/react";
import React from "react";
import { FaCircle } from "react-icons/fa";
import { StatusType, User, UserStatus } from "../models";

type Props = AvatarProps & {
  user?: User;
  src?: string;
};

const getStatusBadgeColor = (status?: UserStatus) => {
  switch (status?.statusType || StatusType.Online) {
    case StatusType.Online:
      return "green.500";
    case StatusType.Offline:
      return "gray.500";
  }
};

export const UserAvatarWithStatus = ({ src, user, ...rest }: Props) => (
  <Avatar
    {...rest}
    src={`https://cdn.miki.bot/chat/avatars/${src || Number(user.id) % 5}.png`}
  >
    <AvatarBadge bg={getStatusBadgeColor(user.status)} boxSize="1.125em" />
  </Avatar>
);
