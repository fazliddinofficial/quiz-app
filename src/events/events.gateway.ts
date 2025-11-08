import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private sessions: Map<string, string[]> = new Map();

  quizStarted(sessionId: string) {
    this.server.to(sessionId).emit('quizStarted', { sessionId });
  }

  async sendQuestion(sessionId: string, question: any) {
    this.server.to(sessionId).emit('newQuestion', question);
  }

  handleConnection(client: Socket, ...args: any[]) {
    const sessionId = client.handshake.query.sessionId as string;
    if (sessionId) {
      this.joinSession(client, sessionId);
    }
  }

  handleDisconnect(client: Socket) {
    this.leaveAllSessions(client);
  }

  private joinSession(client: Socket, sessionId: string) {
    client.join(sessionId);

    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, []);
    }
    this.sessions.get(sessionId)?.push(client.id);
  }

  private leaveAllSessions(client: Socket) {
    this.sessions.forEach((socketIds, sessionId) => {
      const updatedSocketIds = socketIds.filter((id) => id !== client.id);
      this.sessions.set(sessionId, updatedSocketIds);
    });
  }

  @SubscribeMessage('joinSession')
  handleJoinSession(client: Socket, sessionId: string) {
    this.joinSession(client, sessionId);
    return { event: 'joined', data: `Joined session ${sessionId}` };
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

  @SubscribeMessage('startQuiz')
  handleStartQuiz(@MessageBody() data: { sessionId: string }) {
    const room = this.server.sockets.adapter.rooms.get(data.sessionId);
    console.log(
      'Room members for session:',
      data.sessionId,
      room ? [...room] : 'No one joined yet',
    );

    this.server.to(data.sessionId).emit('quizStarted', { sessionId: data.sessionId });

    console.log('Backend emitted event quizStarted');
  }

  @SubscribeMessage('nextQuestion')
  handleNextQuestion(@MessageBody() data: { sessionId: string; question: any }) {
    this.sendQuestion(data.sessionId, data.question);
  }

  @SubscribeMessage('answerSubmitted')
  handleAnswerSubmitted(
    @MessageBody()
    data: {
      sessionId: string;
      questionIndex: number;
      answer: string;
      clientId?: string;
    },
  ) {
    console.log('Answer submitted in session: ', data.sessionId, {
      questionIndex: data.questionIndex,
      answer: data.answer,
      clientId: data.clientId,
    });

    this.server.to(data.sessionId).emit('answerReceived', {
      questionIndex: data.questionIndex,
      answer: data.answer,
      clientId: data.clientId,
      timestamp: new Date().toISOString(),
    });
  }
}
