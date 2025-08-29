"use client";
import Link from "next/link";
import { Text } from "../common/Text/Text";
import { SignupForm } from "./SignupForm";
import { LOGIN_ROUTE } from "@/constants/clientRoutes";
import styles from "./Signup.module.scss";

export const Signup = () => {
  return (
    <div className={styles.container}>
      <SignupForm />
      <div className={styles.loginLink}>
        <Text className={styles.caption}> Already have an account?</Text>
        <Link href={LOGIN_ROUTE}>
          <Text className={styles.linkText}>Log in</Text>
        </Link>
      </div>
    </div>
  );
};
