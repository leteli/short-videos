import { useCallback, useState } from "react";
import Modal from "react-modal";
import { useUnit } from "effector-react";
import { createDirectChatFx } from "@/stores";
import { Text, Variants, Tags } from "../common/Text/Text";
import { UsersSearch } from "../UserSearch/UsersSearch";
import styles from "./Modal.module.scss";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

Modal.setAppElement("body");

export const AddChatModal = ({ isOpen, onClose }: IProps) => {
  const [error, setError] = useState<string | null>(null);
  const { createDirectChat } = useUnit({ createDirectChat: createDirectChatFx, createDirectChatPending: createDirectChatFx.pending });

  const handleUserSelect = useCallback(
    async (userId: string) => {
      try {
      await createDirectChat({ participantId: userId });
      onClose();
      } catch (e) {
        console.error('Error creating chat:', e);
        setError('Failed to create chat. Please try again.');
        // TODO: handle
      }
    },
    [createDirectChat, onClose]
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.container}
      overlayClassName={styles.overlay}
    >
        <Text tag={Tags.h2} variant={Variants.h2}>
          New chat
        </Text>
        <UsersSearch onSelect={handleUserSelect} setError={setError} error={error} />
    </Modal>
  );
};
