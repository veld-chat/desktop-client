import { User } from "@/models";
import { RootState } from "@/store";
import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { connect } from "react-redux";
import { UserAvatar } from "../UserAvatar";
import UserQrCode from "../UserQrCode";
import { UserInfoForm } from "./forms/UserInfoForm";

interface Props {
  user?: User;
}

const UserPanel = ({ user }: Props) => {
  const [isEditingUser, setIsEditingUser] = useState(false);

  return (
    <Box m="6">
      <Heading fontSize="xl" mb="6">
        User Profile
      </Heading>
      <Flex
        borderRadius="lg"
        bg="gray.700"
        p="4"
        my="2"
        justify="space-between"
        align="center"
      >
        {isEditingUser ? (
          <UserInfoForm onClose={() => setIsEditingUser(false)} user={user} />
        ) : (
          <>
            <Flex>
              <UserAvatar user={user} />
              <Box>
                <Text>{user.name}</Text>
              </Box>
            </Flex>
            <IconButton
              aria-label="edit profile"
              icon={<FaEdit />}
              onClick={() => setIsEditingUser(true)}
              size="sm"
            />
          </>
        )}
      </Flex>
      <Heading fontSize="xl" my="6">
        Authorization
      </Heading>
      <UserQrCode />
    </Box>
  );
};

const mapStateToProps = (state: RootState, props: Props): Props => {
  return {
    user: state.users.usersById[state.sessions.user]
  };
};

export default connect(mapStateToProps)(UserPanel);
