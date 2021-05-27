import React from "react";
import {
  CloseButton,
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import UserPanel from "./settings/UserPanel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: Props) => {
  const graySecondary = useColorModeValue("gray.200", "gray.600");

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
                  borderRadius="md"
                  key="user"
                  justifyContent="flex-start"
                  background={graySecondary}
                >
                  User
                </Tab>
                <Tab
                  w="full"
                  borderRadius="md"
                  justifyContent="flex-start"
                  key="logout"
                  color="red.500"
                  background={graySecondary}
                >
                  Log out
                </Tab>
              </VStack>
            </TabList>
            <TabPanels
              h="full"
              minH="lg"
              borderRadius="lg"
              background={graySecondary}
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
