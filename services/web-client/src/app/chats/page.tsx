import { headers } from "next/headers";
import { EffectorNext } from "@effector/next";
import { fork, allSettled, serialize } from "effector";

import { getChatsFx } from "@/stores";
import { setAuth } from "@/stores";
import { IAuthSearchParams } from "@/stores/auth/types";

import { Header } from "@/components/common/Header/Header";
import { ChatsList } from "@/components/ChatsList/ChatsList";
import { Chat } from "@/components/Chat/Chat";
import styles from "@/app/page.module.scss";
import { FetchItemshModes, AUTH_TOKEN_HEADER } from "@/constants/http";
import { ChatsSocketProvider } from "@/contexts/SocketContext";

export default async function ChatsPage({ searchParams }: IAuthSearchParams) {
  const user = await searchParams;
  const headersList = await headers();
  const token = headersList.get(AUTH_TOKEN_HEADER);

  const scope = fork();
  await allSettled(setAuth, { scope, params: { user } });
  await allSettled(getChatsFx, { scope, params: { mode: FetchItemshModes.replace, serverSide: true } });

  const values = serialize(scope);
  return (
    <ChatsSocketProvider token={token}>
      <EffectorNext values={values}>
        <div className={styles.main}>
          <Header />
          <div className={styles.chatsWrapper}>
            <ChatsList/>
            <Chat />
          </div>
        </div>
      </EffectorNext>
    </ChatsSocketProvider>
  );
};
