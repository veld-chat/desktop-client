import { Avatar, AvatarProps } from "@chakra-ui/react";
import React from "react";
import { User } from "../models";

type Props = AvatarProps & {
  user?: User;
};

export const UserAvatar = ({ user, ...rest }: Props) => (
  <Avatar
    {...rest}
    src={`https://cdn.miki.bot/chat/avatars/${
      user.avatarUrl || Number(user.id) % 5
    }.png`}
  />
);
