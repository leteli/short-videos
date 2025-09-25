"use client"
import { useUnit } from "effector-react";
import { $authStore, logoutFx } from "@/stores";
import { Text } from "../Text/Text";
import { Button, ButtonSize, ButtonVariant } from "../Button/Button";
import styles from "./Header.module.scss";

export const Header = () => {
  const { authStore, logout } = useUnit({ authStore: $authStore, logout: logoutFx });
  return (
    <div className={styles.container}>
      <Text>{authStore.user?.username}</Text>
      <Button
        text="Sign out"
        variant={ButtonVariant.secondary}
        size={ButtonSize.small}
        onClick={logout}
      />
    </div>
  );
};
