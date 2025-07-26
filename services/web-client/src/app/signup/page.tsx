import { EffectorNext } from "@effector/next";
import { fork, serialize } from "effector";
import styles from "../page.module.scss";
import { SignupForm } from "@/components/Signup/SignupForm";

export default async function SignupPage() {
  const scope = fork();
  const values = serialize(scope);
  return (
    <EffectorNext values={values}>
      <div className={styles.main}>
        <SignupForm />
      </div>
    </EffectorNext>
  );
}
