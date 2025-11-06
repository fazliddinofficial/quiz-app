import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private sessions: Map<string, string[]> = new Map();

  handleConnection(client: Socket, ...args: any[]) {
    console.log("Client connected: ", client.id);

    const sessionId = client.handshake.query.sessionId as string;
    if (sessionId) {
      this.joinSession(client, sessionId)
    }
  }

  handleDisconnect(client: Socket) {
    console.log("Client disconnected: ", client.id)
    this.leaveAllSessions(client)
  }

  private joinSession(client: Socket, sessionId: string) {
    client.join(sessionId)

    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, []);
    }
    this.sessions.get(sessionId)?.push(client.id);

    console.log(`Client ${client.id} joined session ${sessionId}`)
  }

  private leaveAllSessions(client: Socket) {
    this.sessions.forEach((socketIds, sessionId) => {
      const updatedSocketIds = socketIds.filter(id => id !== client.id);
      this.sessions.set(sessionId, updatedSocketIds)
    });
  }

  @SubscribeMessage('joinSession')
  handleJoinSession(client: Socket, sessionId: string) {
    this.joinSession(client, sessionId)
    return { event: 'joined', data: `Joined session ${sessionId}` }
  }

  emitToSession(sessionId: string, event: string, data: any) {
    this.server.to(sessionId).emit(event, data);
  }

  notifyStudentJoined(sessionId: string, student: any) {
    this.emitToSession(sessionId, 'studentJoined', student);
  }

  notifyStudentLeft(sessionId: string, studentId: string) {
    this.emitToSession(sessionId, 'studentLeft', studentId);
  }

  notifyStudentsUpdated(sessionId: string, students: any[]) {
    this.emitToSession(sessionId, 'studentsUpdated', students);
  }
}