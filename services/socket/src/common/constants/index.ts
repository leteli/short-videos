export enum QueueNames {
  Socket = 'Socket',
  Core = 'Core',
}

export const SOCKET_FALLBACK_PORT = 8001;

export enum SocketEvents {
  ChatCreated = 'chat:create',
  ChatJoined = 'chat:join',
  ChatLeft = 'chat:leave',
  MessageSent = 'message:send',
  MessageReceived = 'message:receive',
  MessageRead = 'message:read',
}

export enum CoreBrokerEvents {
  ChatCreated = 'ChatCreated',
}

export enum PublishedBrokerEvents {
  CreateMessage = 'CreateMessage',
}
