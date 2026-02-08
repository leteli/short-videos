"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@/constants/http";

interface ISocketContext {
  socket: Socket | null;
  subscribe: (event: SocketEvents, handler: (...args: unknown[]) => void) => void;
  unsubscribe: (event: SocketEvents, handler: (...args: unknown[]) => void) => void;
  emit: (event: SocketEvents, data: unknown) => Promise<unknown>;
}
interface EventListeners {
  [key: string]: ((...args: unknown[]) => void)[];
}

export enum SocketEvents {
  ChatCreated = 'chat:create',
  ChatJoined = 'chat:join',
  ChatLeft = 'chat:leave',
  MessageSent = 'message:send',
  MessageReceived = 'message:receive',
  MessageRead = 'message:read',
}

const SocketContext = createContext<ISocketContext>({} as ISocketContext);

export const useSocket = () => useContext(SocketContext);

interface ISocketProviderProps {
  children: ReactNode;
  query?: Record<string, unknown>;
  token: string | null;
}

export const SocketProvider = ({ children, token, query }: ISocketProviderProps) => {
  const socketRef = useRef<Socket | null>(null);
  const eventListenersRef = useRef<EventListeners>({});

  const subscribe = useCallback(
    (event: SocketEvents, handler: (...args: unknown[]) => void) => {
      if (socketRef.current) {
        socketRef.current.on(event, handler);
      }

      eventListenersRef.current[event] = eventListenersRef.current[event] || [];
      eventListenersRef.current[event].push(handler);
    },
    []
  );

  const unsubscribe = useCallback(
    (event: SocketEvents, handler: (...args: unknown[]) => void) => {
      if (socketRef.current) {
        socketRef.current.off(event, handler);
      }

      if (eventListenersRef.current[event]?.length) {
        eventListenersRef.current[event] = eventListenersRef.current[
          event
        ].filter((el) => el !== handler);
        if (!eventListenersRef.current[event]?.length) {
          delete eventListenersRef.current[event];
        }
      }
    },
    []
  );

  const emit = useCallback(
    (event: SocketEvents, data: unknown) =>
      new Promise((resolve, reject) => {
        if (socketRef?.current) {
          socketRef.current.emit(
            event,
            data,
            (answer: unknown, err: unknown) => {
              if (err) {
                reject(err);
              } else {
                resolve(answer);
              }
            }
          );
        }
      }),
    []
  );

  useEffect(() => {
    if (socketRef.current || !token) {
      return;
    }
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      ...(query && { query }),
    });
    console.log("socket:connect");
    const listeners = eventListenersRef.current;

    Object.keys(listeners).forEach((event) => {
      listeners[event].forEach((handler) => {
        socketRef.current?.on(event, handler);
      });
    });

    return () => {
      Object.keys(listeners).forEach((event) => {
        listeners[event].forEach((handler) => {
          socketRef.current?.off(event, handler);
        });
      });
      socketRef.current?.disconnect();
      socketRef.current = null;
      console.log("socket:disconnect");
    };
  }, [query, token]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        subscribe,
        unsubscribe,
        emit,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};


export const ChatsSocketProvider = ({
  children,
  token,
  query,
}: ISocketProviderProps) => {
  return (
    <SocketProvider
      token={token}
      {...(query && { query })}
    >
      {children}
    </SocketProvider>
  );
};
