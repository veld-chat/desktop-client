import React from "react";
import { User } from "@/models";
import { connect } from "react-redux";
import { RootState } from "../store";
import { UserRow } from "./UserRow";
import { Text } from "@chakra-ui/layout";
import { Flex, IconButton, useDisclosure } from "@chakra-ui/react";
import { FaCog } from "react-icons/fa";
import { SettingsModal } from "./SettingsModal";

interface Props {
  user?: User;
}

const CurrentUser = ({ user }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (!user) {
    return <Text>Not logged in!</Text>;
  }

  return (
    <Flex align="center">
      <UserRow
        showStatus
        user={user}
        children={
          user.status?.statusText && (
            <Text fontSize="xs" color="gray.400">
              {user.status?.statusText}
            </Text>
          )
        }
      />
      <Flex>
        <IconButton
          bg="transparent"
          aria-label="settings"
          onClick={onOpen}
          icon={<FaCog />}
        />
        <SettingsModal isOpen={isOpen} onClose={onClose} />
      </Flex>
    </Flex>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    user: state.users.usersById[state.sessions?.user],
  };
};

export default connect(mapStateToProps)(CurrentUser);
