import React from "react";
import Icon from "@chakra-ui/icon";
import { Flex } from "@chakra-ui/layout";
import { FaHashtag } from "react-icons/fa";
import { connect } from "react-redux";
import { Channel } from "../models";
import { RootState } from "../store";

interface Props {
  channel?: Channel;
}

const CurrentChannelHeader = ({ channel }: Props) => {
  return (
    <Flex align="center" mx="4">
      <Icon as={FaHashtag} color="gray.400" mr="1" />
      {channel?.name}
    </Flex>
  );
};

const mapStateToProps = (state: RootState): Props => {
  return {
    channel: state.channels.channelsById[state.channels.currentChannel],
  };
};

export default connect(mapStateToProps)(CurrentChannelHeader);
