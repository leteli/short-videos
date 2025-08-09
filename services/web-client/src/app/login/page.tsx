import { Login } from "@/components/Login/Login";
import styles from "../page.module.scss";

export default async function LoginPage() {
  return (
    <div className={styles.main}>
      <Login />
    </div>
  );
}
