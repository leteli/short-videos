import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { parseString } from 'src/common/utils/parsers/parseString';
import { SocketEvents } from 'src/common/constants';
import {
  MessageSentPayload,
  HandlerStatus,
  IChatCreatedPayload,
  IUserJwtPayload,
} from 'src/common/interfaces/gateway';
import { RabbitMqService } from 'src/rabbitmq/rabbitmq.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: parseString(process.env.CLIENT_URL, 'http://localhost:3004'),
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly rabbitMqService: RabbitMqService,
    private jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Socket initialized');
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    server.use(async (socket: Socket, next) => {
      try {
        const token = socket.handshake.auth?.token as string | undefined;
        if (!token) {
          return next(new Error('Unauthorized'));
        }
        const payload =
          await this.jwtService.verifyAsync<IUserJwtPayload>(token);

        if (!payload?.id) {
          return next(new Error('Unauthorized'));
        }
        const typedSocketData = socket.data as { userId?: string };
        typedSocketData.userId = payload.id;
        return next();
      } catch (error) {
        this.logger.error(`Auth validation error ${JSON.stringify(error)}`);
        return next(new Error('Unauthorized'));
      }
    });
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client id: ${client.id} connected`);
    const typedSocketData = client.data as { userId?: string };

    const userId = typedSocketData.userId;
    if (!userId) {
      this.logger.error('No user info provided');
      client.disconnect();
      return;
    }
    const roomName = this.buildUserRoomName(userId);
    await client.join(roomName);
    this.logger.log(`Client ${client.id} has joined room: ${roomName}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket) {
    this.logger.log(`Ping received from client id: ${client.id}`);
  }

  emitEvent<T>({
    event,
    room,
    data,
  }: {
    event: SocketEvents;
    room: string;
    data: T;
  }) {
    this.server.to(room).emit(event, { ...data, timestamp: Date.now() });
  }

  broadcastEvent<T>({
    event,
    room,
    exceptSocketId,
    data,
  }: {
    event: SocketEvents;
    room: string;
    exceptSocketId: string;
    data: T;
  }) {
    this.server
      .to(room)
      .except(exceptSocketId)
      .emit(event, { ...data, timestamp: Date.now() });
  }

  handleChatCreated(data: IChatCreatedPayload) {
    if (!data?.chat) return;
    this.emitEvent({
      event: SocketEvents.ChatCreated,
      room: this.buildUserRoomName(data?.chat.userId),
      data,
    });
  }

  @SubscribeMessage(SocketEvents.ChatJoined)
  async handleUserJoinedChat(client: Socket, data: { chatId: string }) {
    if (!data?.chatId) {
      this.logger.error(`Invalid payload ${data ? JSON.stringify(data) : ''}`);
      return;
    }
    try {
      await client.join(this.buildChatRoomName(data.chatId));
    } catch (error) {
      this.logger.error(error);
    }
  }

  @SubscribeMessage(SocketEvents.ChatLeft)
  async handleUserLeftChat(client: Socket, data: { chatId: string }) {
    if (!data?.chatId) {
      this.logger.error(`Invalid payload ${data ? JSON.stringify(data) : ''}`);
      return;
    }
    try {
      await client.leave(this.buildChatRoomName(data.chatId));
    } catch (error) {
      this.logger.error(error);
    }
  }

  @SubscribeMessage(SocketEvents.MessageSent)
  async handleMessageSent(client: Socket, data: MessageSentPayload) {
    const result = await this.rabbitMqService.handleSendMessage({
      message: data,
    });
    const chatId = result?.message?.chatId;
    if (!chatId) return;

    const roomName = this.buildChatRoomName(chatId);
    if (result?.status === HandlerStatus.Success) {
      const { message } = result;
      this.broadcastEvent({
        event: SocketEvents.MessageReceived,
        room: roomName,
        exceptSocketId: client.id,
        data: { message },
      });
      return { ok: true, message: result.message };
    } else {
      return { ok: false, message: data, error: result.error };
    }
  }

  buildUserRoomName(userId: string) {
    return `user:${userId}`;
  }
  buildChatRoomName(chatId: string) {
    return `chat:${chatId}`;
  }
}
