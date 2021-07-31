import "../style/index.scss";

import React, { useEffect } from "react";
import { Box, Flex, GridItem, SimpleGrid } from "@chakra-ui/react";
import { connect } from "../store/services/websocket";
import MemberList from "../components/MemberList";
import ChannelList from "../components/ChannelList";
import MessageList from "../components/MessageList";
import { Layout } from "../components/Layout";
import CurrentUser from "../components/CurrentUser";
import ChatBox from "../components/chatbox";
import CurrentChannelHeader from "../components/CurrentChannelHeader";
import { Helmet } from "react-helmet";

const IndexPage = () => {
  useEffect(() => {
    connect();
  }, []);

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
        templateColumns="280px 1fr 280px"
        templateRows="50px 1fr"
      >
        <GridItem
          colSpan={1}
          borderBottom="2px"
          borderBottomColor="gray.700"
          bg="gray.600"
        ></GridItem>
        <GridItem
          colSpan={2}
          borderBottom="2px"
          borderBottomColor="gray.700"
          bg="gray.600"
        >
          <Flex h="full" align="center" justify="space-between">
            <Flex>
              <CurrentChannelHeader />
            </Flex>
            <Flex>
              {/* TODO(Veld): handle events from app
              <Tooltip
                label="Update Available"
                aria-label="Update Available"
                bg="gray.700"
                color="white"
              >
                 <IconButton
                  aria-label="Update Available"
                  icon={<FaCloudDownloadAlt />}
                  color="green.500"
                  colorScheme="green"
                  variant="ghost"
                />
              </Tooltip>
              */}
            </Flex>
          </Flex>
        </GridItem>
        <Flex
          h="full"
          p="4"
          direction="column"
          justify="space-between"
          background="gray.700"
        >
          <Box flex="1">
            <ChannelList />
          </Box>
          <Box borderTop="solid 1px" pt="4" borderTopColor="gray.400">
            <CurrentUser />
          </Box>
        </Flex>
        <Flex
          h="full"
          mx="16"
          background="gray.600"
          direction="column"
          overflow="hidden"
        >
          <Box px="4" flex="1" mb="4" overflowY="hidden">
            <MessageList />
          </Box>
          <Box px="4" mb="16" borderRadius="lg">
            <ChatBox />
          </Box>
        </Flex>
        <Box h="full" p="4" background="gray.700">
          <MemberList />
        </Box>
      </SimpleGrid>
    </Layout>
  );
};

export default IndexPage;
