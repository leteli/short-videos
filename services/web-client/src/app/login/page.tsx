import clsx from "clsx";
import { Login } from "@/components/Login/Login";
import styles from "../page.module.scss";

export default async function LoginPage() {
  return (
    <div className={clsx(styles.main, styles.authPage)}>
      <Login />
    </div>
  );
}
