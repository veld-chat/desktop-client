import {
  Heading,
  Text,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  HStack,
  Button,
  VStack,
} from "@chakra-ui/react";
import { client } from "../../api-client";
import React, { useState } from "react";

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
  channelId: string;
};

const IntroductionModal = ({ isOpen, onClose, channelId }: Props) => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    client()
      .editUser(name)
      .then(() =>
        client().sendMessage(
          channelId,
          `Hello everyone! My name is ${name}. Nice to meet you!`
        )
      )
      .then(() => {
        setIsLoading(false);
        onClose();
      });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <VStack w="full" align="flex-start" spacing="16">
            <Heading size="md">👋 Nice to meet you!</Heading>
            <VStack w="full" align="flex-start" spacing="8">
              <Text>What should we call you?</Text>
              <HStack w="full">
                <Input
                  placeholder="guest"
                  onChange={(e) => setName(e.target.value)}
                  flex="1"
                />
                <Button isLoading={isLoading} onClick={handleSubmit}>
                  Submit
                </Button>
              </HStack>
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default IntroductionModal;
