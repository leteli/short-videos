import { EffectorNext } from "@effector/next";
import clsx from "clsx";
import { fork, serialize } from "effector";
import styles from "../page.module.scss";
import { Signup } from "@/components/Signup/Signup";

export default async function SignupPage() {
  const scope = fork();
  const values = serialize(scope);
  return (
    <EffectorNext values={values}>
      <div className={clsx(styles.main, styles.authPage)}>
        <Signup />
      </div>
    </EffectorNext>
  );
}
