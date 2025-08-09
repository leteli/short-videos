"use client"
import { useUnit } from "effector-react";
import { logoutFx } from "@/stores";
import { Button, ButtonSize, ButtonVariant } from "../Button/Button";
import styles from "./Header.module.scss";

export const Header = () => {
  const logout = useUnit(logoutFx);
  return (
    <div className={styles.container}>
      <Button
        text="Sign out"
        variant={ButtonVariant.secondary}
        size={ButtonSize.small}
        onClick={logout}
      />
    </div>
  );
};
