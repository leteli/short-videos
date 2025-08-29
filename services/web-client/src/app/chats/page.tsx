import { EffectorNext } from "@effector/next";
import { fork, allSettled, serialize } from "effector";

import { getChatsFx, setAuth } from "@/stores";
import { IAuthSearchParams } from "@/stores/auth/types";

import { Header } from "@/components/common/Header/Header";
import { ChatsList } from "@/components/ChatsList/ChatsList";
import { Chat } from "@/components/Chat/Chat";
import styles from "@/app/page.module.scss";

export default async function ChatsPage({ searchParams }: IAuthSearchParams) {
  const user = await searchParams;
  const scope = fork();
  await allSettled(getChatsFx, { scope, params: {} })
  await allSettled(setAuth, { scope, params: { user } });
  const values = serialize(scope);
  return (
    <EffectorNext values={values}>
      <div className={styles.main}>
        <Header />
        <div className={styles.chatsWrapper}>
          <ChatsList/>
          <Chat />
        </div>
      </div>
    </EffectorNext>
  );
};
