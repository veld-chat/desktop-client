import React from "react";
import {
  Box,
  Button,
  CloseButton,
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack
} from "@chakra-ui/react";
import { FaArrowCircleRight, FaUser } from "react-icons/fa";
import UserPanel from "./settings/UserPanel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: Props) => {
  return (
    <Drawer onClose={onClose} isOpen={isOpen} size="full" motionPreset="scale">
      <DrawerOverlay />
      <DrawerContent>
        <Container maxW="container.lg">
          <Flex mb="8" align="center" justify="space-between">
            <DrawerHeader>Settings</DrawerHeader>
            <CloseButton onClick={onClose} />
          </Flex>
          <Tabs orientation="vertical" variant="unstyled">
            <TabList minW="180" alignItems="flex-start" mr="2">
              <VStack w="full">
                <Tab
                  w="full"
                  borderRadius="lg"
                  key="user"
                  justifyContent="flex-start"
                  background="gray.600"
                >
                  <Icon as={FaUser} mr="2" />
                  User
                </Tab>
                <Tab
                  w="full"
                  borderRadius="lg"
                  justifyContent="flex-start"
                  key="logout"
                  color="red.500"
                  background="gray.600"
                >
                  <Icon as={FaArrowCircleRight} mr="2" />
                  Log out
                </Tab>
              </VStack>
            </TabList>
            <TabPanels
              h="full"
              minH="lg"
              borderRadius="lg"
              background="gray.600"
            >
              <TabPanel>
                <UserPanel />
              </TabPanel>
              <TabPanel>
                <Text>Lol this is not actually a feature.</Text>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
        <DrawerBody />
      </DrawerContent>
    </Drawer>
  );
};
