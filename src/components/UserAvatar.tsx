import { Avatar, AvatarProps, ComponentWithAs } from "@chakra-ui/react";
import React from "react";
import { User } from "../models";

type Props = {
  user?: User;
};

export const UserAvatar = ({ user, ...rest }: Props) => (
  <Avatar
    {...rest}
    mr="2"
    size="sm"
    src={`https://cdn.miki.bot/chat/avatars/${user.avatarUrl ||
      Number(user.id) % 5}.png`}
  />
);
