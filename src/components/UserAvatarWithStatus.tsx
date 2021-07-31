import { Avatar, AvatarBadge, AvatarProps } from "@chakra-ui/react";
import React from "react";
import { StatusType, User, UserStatus } from "../models";

type Props = AvatarProps & {
  user?: User;
};

const getStatusBadgeColor = (status?: UserStatus) => {
  switch (status?.statusType || StatusType.Online) {
    case StatusType.Online:
      return "system.success";
    case StatusType.Away:
      return "system.warning";
    case StatusType.Busy:
      return "system.error";
    case StatusType.Offline:
      return "background.dark";
  }
};

export const UserAvatarWithStatus = ({ user, ...rest }: Props) => (
  <Avatar
    {...rest}
    src={`https://cdn.miki.bot/chat/avatars/${
      user.avatarUrl || Number(user.id) % 5
    }.png`}
  >
    <AvatarBadge bg={getStatusBadgeColor(user.status)} boxSize="12px" />
  </Avatar>
);
