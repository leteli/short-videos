import { EffectorNext } from "@effector/next";
import { fork, allSettled, serialize } from "effector";
import { setAuth } from "@/stores";
import { IAuthSearchParams } from "@/stores/auth/types";
import { Header } from "@/components/common/Header/Header";
import styles from "@/app/page.module.scss";

export default async function ChatsPage({ searchParams }: IAuthSearchParams) {
  const user = await searchParams;
  const scope = fork();
  await allSettled(setAuth, { scope, params: { user } });
  const values = serialize(scope);
  return (
    <EffectorNext values={values}>
      <div className={styles.main}>
        <Header />
        <div>Chats</div>
      </div>
    </EffectorNext>
  );
}
