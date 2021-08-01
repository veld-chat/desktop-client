import "../style/index.scss";

import React, { useEffect } from "react";
import {
  Box,
  Flex,
  GridItem,
  Icon,
  IconButton,
  SimpleGrid,
} from "@chakra-ui/react";
import { connect } from "../store/services/websocket";
import MemberList from "../components/MemberList";
import ChannelList from "../components/ChannelList";
import MessageList from "../components/MessageList";
import { Layout } from "../components/Layout";
import CurrentUser from "../components/CurrentUser";
import ChatBox from "../components/chatbox";
import CurrentChannelHeader from "../components/CurrentChannelHeader";
import { Helmet } from "react-helmet";
import { FaDiscord, FaUserAlt } from "react-icons/fa";

const IndexPage = () => {
  useEffect(() => {
    connect();
  }, []);

  const [membersOpen, setMembersOpen] = React.useState(true);

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Veld Chat</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="*"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        ></link>
      </Helmet>
      <SimpleGrid
        h="100vh"
        overflowY="hidden"
        templateColumns="280px 1fr"
        templateRows="50px 1fr"
      >
        <GridItem
          colSpan={1}
          bg="dark.20"
          borderBottom="1px solid"
          borderBottomColor="dark.40"
        ></GridItem>
        <GridItem
          colSpan={1}
          bg="dark.20"
          px="16"
          borderBottom="1px solid"
          borderBottomColor="dark.40"
        >
          <Flex h="full" align="center" justify="space-between">
            <Flex>
              <CurrentChannelHeader />
            </Flex>
            <Flex>
              <IconButton
                bg="transparent"
                color={membersOpen ? "bright.100" : "bright.40"}
                icon={<Icon as={FaUserAlt} boxSize="16" />}
                aria-label={membersOpen ? "Hide Members" : "Show Members"}
                onClick={() => setMembersOpen(!membersOpen)}
              />
              <IconButton
                as="a"
                href="https://discord.gg/wbn7WxWeb2"
                bg="transparent"
                icon={<Icon as={FaDiscord} boxSize="16" />}
                aria-label={membersOpen ? "Hide Members" : "Show Members"}
                onClick={() => setMembersOpen(!membersOpen)}
              />
            </Flex>
          </Flex>
        </GridItem>
        <Flex bg="dark.10" h="full" direction="column" justify="space-between">
          <Box p="16" flex="1">
            <ChannelList />
          </Box>
          <Box
            p="16"
            borderTop="solid 1px"
            borderTopColor="dark.40"
            pt="16"
            bg="dark.10"
          >
            <CurrentUser />
          </Box>
        </Flex>
        <Flex h="full" direction="row" overflow="hidden">
          <Flex
            mx="16"
            h="full"
            justify="space-between"
            direction="column"
            flex="1"
          >
            <Box px="4" overflowY="hidden">
              <MessageList />
            </Box>
            <Box px="4" mb="16" borderRadius="lg">
              <ChatBox />
            </Box>
          </Flex>
          {membersOpen && (
            <Box h="full" w="240px" p="16" background="dark.10">
              <MemberList />
            </Box>
          )}
        </Flex>
      </SimpleGrid>
    </Layout>
  );
};

export default IndexPage;
