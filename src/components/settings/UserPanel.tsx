import { User } from "@/models";
import { RootState } from "@/store";
import { Box, Flex, Heading, HStack, IconButton, Text } from "@chakra-ui/react";
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
      <Heading fontSize="xl" my="24">
        User Profile
      </Heading>
      <Flex
        borderRadius="lg"
        bg="bright.10"
        py="12"
        px="16"
        my="2"
        justify="space-between"
        align="center"
      >
        {isEditingUser ? (
          <UserInfoForm onClose={() => setIsEditingUser(false)} user={user} />
        ) : (
          <>
            <HStack spacing="16">
              <UserAvatar user={user} />
              <Box>
                <Text>{user.name}</Text>
              </Box>
            </HStack>
            <IconButton
              aria-label="edit profile"
              icon={<FaEdit />}
              onClick={() => setIsEditingUser(true)}
            />
          </>
        )}
      </Flex>
      <Heading fontSize="xl" my="24">
        Authorization
      </Heading>
      <UserQrCode />
    </Box>
  );
};

const mapStateToProps = (state: RootState, props: Props): Props => {
  return {
    user: state.users.usersById[state.sessions.user],
  };
};

export default connect(mapStateToProps)(UserPanel);
