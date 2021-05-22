import { Channel } from "@/models";
import { RootState } from "@/store";
import { Box, Flex, Heading, Icon, IconButton, Text } from "@chakra-ui/react";
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
    <Box>
      <Flex w="full" justifyContent="space-between"borderBottom="1px solid" borderBottomColor="gray.300" pb="2" mb="2">
        <Heading fontSize="md">
          Channels
        </Heading>
        <IconButton aria-label="add channel" size="xs" background="transparent" icon={<FaPlus/>}/>
      </Flex>
      {channels?.map(c => (
        <Flex key={c.id} 
          px="2" 
          py="1" 
          align="center" 
          borderRadius="md" 
          background={c.id == currentChannel ? "gray.600" : "transparent"}
        >
          <Icon as={FaHashtag} h="3" w="3" mr="1"/>
          <Text>{c.name}</Text>
        </Flex>
      ))}
    </Box>
  );
};

const mapStateToProps = (state: RootState, props: Props) => {
  return {
    channels: state.channels.channels,
    currentChannel: state.channels.currentChannel
  };
};

export default connect(mapStateToProps)(ChannelList);
