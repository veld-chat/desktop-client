import { StatusType, User, UserStatus } from "../models";
import { RootState } from "../store";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { connect } from "react-redux";
import { UserRow } from "./UserRow";
import { sortUserByStatusThenName } from "../utils/sorts";

interface Props {
  users?: User[];
}

const fromStatus = (status?: UserStatus): string => {
  switch (status?.statusType || 0) {
    case StatusType.Offline:
      return "Offline";
    case StatusType.Online:
      return "Online";
  }
};

export const MemberList = ({ users }: Props) => {
  if (!users) {
    return <Text>Nobody is here</Text>;
  }

  return (
    <Box>
      {[...users]
        .sort(sortUserByStatusThenName)
        .filter(
          (x) => x.name != "guest" || x.status.statusType != StatusType.Offline
        )
        .map((u) => (
          <Box mb="1" key={u.id}>
            <UserRow showStatus user={u}>
              <Text fontSize="xs" color="gray.400">
                {u.status?.statusText || fromStatus(u.status)}
              </Text>
            </UserRow>
          </Box>
        ))}
    </Box>
  );
};

const mapStateToProps = (state: RootState): Props => {
  return {
    users: state.users.users,
  };
};

export default connect(mapStateToProps)(MemberList);
