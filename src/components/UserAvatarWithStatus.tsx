import {
  Avatar,
  AvatarBadge,
  AvatarProps,
} from "@chakra-ui/react";
import React from "react";
import { StatusType, User, UserStatus } from "../models";

type Props = AvatarProps & {
  user?: User;
  src?: string;
};

const getStatusBadgeColor = (status?: UserStatus) => {
  switch (status?.statusType || StatusType.Online) {
    case StatusType.Online:
      return "status.success";
    case StatusType.Offline:
      return "bright.100";
  }
};

export const UserAvatarWithStatus = ({ user, ...rest }: Props) => (
  <Avatar
    {...rest}
    src={`https://cdn.miki.bot/chat/avatars/${user.avatarUrl ||
      Number(user.id) % 5}.png`}
  >
    <AvatarBadge bg={getStatusBadgeColor(user.status)} boxSize="1.125em" />
  </Avatar>
);
