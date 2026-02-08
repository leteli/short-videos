import { useEffect } from "react";
import { useSocket, SocketEvents } from "@/contexts/SocketContext";

interface IArgs {
  event: SocketEvents;
  handler: (...args: unknown[]) => void;
  shouldSubscribe?: boolean;
}

export const useSocketSubscribe = ({ event, handler }: IArgs) => {
  const { subscribe, unsubscribe } = useSocket();
  useEffect(() => {
    subscribe(event, handler);

    return () => {
      unsubscribe(event, handler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, handler]);
};
