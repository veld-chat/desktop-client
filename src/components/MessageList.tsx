import { Message } from "../models";
import { RootState } from "../store";
import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { MessageRow } from "./Message";
import { Box } from "@chakra-ui/layout";
import { Alert, AlertTitle, Button } from "@chakra-ui/react";
import { read } from "../store/reducers/messages";

interface Props {
  messages?: Message[];
  channelId?: string;
  newMessages?: boolean;
}

const MessageList = ({ channelId, messages, newMessages }: Props) => {
  const [isBottom, setIsBottom] = useState(true);
  const ref = useRef<HTMLDivElement>();
  const dispatch = useDispatch();

  const handleScroll = () => {
    const newIsBottom = (ref.current?.scrollHeight - ref.current?.offsetHeight) - 
      ref.current?.scrollTop < 1;

    if(newIsBottom && newIsBottom != isBottom) {
      dispatch(read({
        messageId: messages?.[messages?.length - 1].id,
        channelId,
      }));
    }
    setIsBottom(newIsBottom);
  };

  const scrollToLatest = () => {
    ref.current?.scrollTo({
      top: ref.current?.scrollHeight,
    });
  }

  useEffect(() => {
    if(!isBottom) {
      return;
    }

    dispatch(read({
      messageId: messages?.[messages?.length - 1].id,
      channelId,
    }));
    scrollToLatest();
  }, [messages, newMessages]);

  return <Box h="full" overflowY="hidden" position="relative">
    <Box ref={ref} onScroll={handleScroll} h="full" overflowY="scroll">
      {messages?.map(c => (<MessageRow key={c.id} message={c} />))}
    </Box>
    {!isBottom && newMessages && (
      <Box>
        <Alert position="absolute" bottom="0" bg="primary.60" borderRadius="lg" justifyContent="space-between">
          <AlertTitle>There are unread messages</AlertTitle>
          <Button bg="primary.500" size="xs" onClick={scrollToLatest}>Scroll down</Button>
        </Alert>
      </Box>
    )}
  </Box>
};

const mapStateToProps = (state: RootState): Props => {
  const channelMessages = state.messages.messagesByChannel[state.channels.currentChannel];

  return {
    messages: channelMessages,
    channelId: state.channels.currentChannel,
    newMessages: channelMessages?.[channelMessages?.length - 1].id != 
      state.messages?.lastMessageRead[state.channels.currentChannel],
  };
};

export default connect(mapStateToProps)(MessageList);
