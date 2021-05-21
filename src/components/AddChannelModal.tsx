import { Modal, ModalOverlay } from "@chakra-ui/modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddChannelModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
    </Modal>
  );
};
