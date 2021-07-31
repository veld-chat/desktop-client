import { Channel } from "@/models";
import { RootState } from "@/store";
import { Box, Flex, Heading, Icon, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { FaHashtag, FaPlus } from "react-icons/fa";
import { connect } from "react-redux";
import store from "../store/store";

interface Props {
  channels?: Channel[];
  currentChannel?: string;
}

const ChannelList = ({ channels, currentChannel }: Props) => {
  return (
    <VStack spacing="8">
      <Flex
        w="full"
        justifyContent="space-between"
      >
        <Heading fontSize="md">CHANNELS</Heading>
      </Flex>
      {channels?.map((c) => (
        <HStack
          key={c.id}
          align="center"
          borderRadius="4"
          spacing="8"
          w="full"
          bg={currentChannel == c.id ? "bright.10" : undefined}
          p={currentChannel == c.id ? "4" : undefined}
        >
          <Icon as={FaHashtag} h="16" w="16" mr="1" color="bright.80" />
          <Text>{c.name}</Text>
        </HStack>
      ))}
    </VStack>
  );
};

const mapStateToProps = (state: RootState, props: Props) => {
  return {
    channels: state.channels.channels,
    currentChannel: state.channels.currentChannel,
  };
};

export default connect(mapStateToProps)(ChannelList);
