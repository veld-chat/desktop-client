import { Message, User } from "../models";
import { RootState } from "../store";
import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { MessageRow } from "./Message";
import { Box } from "@chakra-ui/layout";
import {
  Alert,
  AlertTitle,
  Button,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { read } from "../store/reducers/messages";
import { client } from "../api-client";
import IntroductionModal from "./IntroductionModal";

interface Props {
  user?: User;
  messages?: Message[];
  channelId?: string;
  newMessages?: boolean;
}

const MessageList = ({ user, channelId, messages, newMessages }: Props) => {
  const [isBottom, setIsBottom] = useState(true);

  const ref = useRef<HTMLDivElement>();
  const dispatch = useDispatch();

  const handleScroll = () => {
    const newIsBottom =
      ref.current?.scrollHeight -
        ref.current?.offsetHeight -
        ref.current?.scrollTop <
      1;

    if (newIsBottom && newIsBottom != isBottom) {
      dispatch(
        read({
          messageId: messages?.[messages?.length - 1].id,
          channelId,
        })
      );
    }
    setIsBottom(newIsBottom);
  };

  const scrollToLatest = () => {
    ref.current?.scrollTo({
      top: ref.current?.scrollHeight,
    });
  };

  useEffect(() => {
    if (!isBottom) {
      return;
    }

    dispatch(
      read({
        messageId: messages?.[messages?.length - 1].id,
        channelId,
      })
    );
    scrollToLatest();
  }, [messages, newMessages]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box h="full" w="full" overflowY="hidden" position="relative">
      <VStack
        ref={ref}
        onScroll={handleScroll}
        h="full"
        whiteSpace="pre-wrap"
        overflowWrap="break-word"
        overflowX="hidden"
        overflowY="scroll"
        align="flex-start"
      >
        <VStack w="full" align="center" maxW="480px" py="48" mx="auto">
          <Text>
            <strong>Welcome to Veld.Chat!</strong> Say Hi to everyone!
          </Text>
          {user && user.name == "guest" && (
            <Button onClick={onOpen}>👋 Introduce yourself</Button>
          )}
        </VStack>
        {messages?.map((c) => (
          <MessageRow key={c.id} message={c} />
        ))}
      </VStack>
      {!isBottom && newMessages && (
        <Box>
          <Alert
            position="absolute"
            bottom="0"
            bg="background.darkSecondary"
            borderRadius="lg"
            justifyContent="space-between"
            zIndex="toast"
          >
            <AlertTitle>There are unread messages</AlertTitle>
            <Button bg="transparent" size="sm" onClick={scrollToLatest}>
              Scroll down
            </Button>
          </Alert>
        </Box>
      )}
      <IntroductionModal
        channelId={channelId}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  );
};

const mapStateToProps = (state: RootState): Props => {
  const channelMessages =
    state.messages.messagesByChannel[state.channels.currentChannel];

  return {
    user: state.users.usersById[state.sessions.user],
    messages: channelMessages,
    channelId: state.channels.currentChannel,
    newMessages:
      channelMessages?.[channelMessages?.length - 1].id !=
      state.messages?.lastMessageRead[state.channels.currentChannel],
  };
};

export default connect(mapStateToProps)(MessageList);
