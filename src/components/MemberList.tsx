import { StatusType, User, UserStatus } from "../models";
import { RootState } from "../store";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { connect } from "react-redux";
import { UserRow } from "./UserRow";

interface Props {
  users?: User[];
}

const fromStatus = (status?: UserStatus): string => {
  switch(status?.statusType || 0) {
    case StatusType.Offline: return "Offline";
    case StatusType.Online: return "Online";
  }
}


export const MemberList = ({ users }: Props) => {
  return (
    <Box>
      {users?.map((u) => (
        <Box mb="1">
        <UserRow showStatus user={u}>
          <Text fontSize="xs" color="gray.400">{u.status?.statusText || fromStatus(u.status)}</Text>
        </UserRow>
        </Box>
      ))}
    </Box>
  );
};

const mapStateToProps = (state: RootState, props: Props): Props => {
  return {
    users: state.users.users,
  }
}

export default connect(mapStateToProps)(MemberList);

