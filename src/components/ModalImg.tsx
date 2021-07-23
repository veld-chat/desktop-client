import React from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { Img, ImgProps } from "@chakra-ui/image";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/modal";

export const ModalledImg = ({ src, ...rest }: ImgProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Img src={src} objectFit="cover" {...rest} onClick={onOpen} />
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="scale"
        isCentered
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <Img src={src} borderRadius="lg" />
        </ModalContent>
      </Modal>
    </>
  );
};
