"use client";
import Link from "next/link";
import { Text } from "../common/Text/Text";
import { LoginForm } from "./LoginForm";
import { SIGNUP_ROUTE } from "@/constants/clientRoutes";
import styles from "./Login.module.scss";

export const Login = () => {
  return (
    <div className={styles.container}>
      <LoginForm />
      <div className={styles.signup}>
        <Text className={styles.caption}>Don’t have an account?</Text>
        <Link href={SIGNUP_ROUTE}>
          <Text className={styles.linkText}>Sign up</Text>
        </Link>
      </div>
    </div>
  );
};
