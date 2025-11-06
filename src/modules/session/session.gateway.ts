import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SessionService } from './session.service';
import { Types } from 'mongoose';

interface ConnectedStudent {
  userId: string;
  socketId: string;
  userName: string;
  joinedAt: Date;
}

interface SessionRoom {
  sessionId: string;
  sessionCode: number;
  students: Map<string, ConnectedStudent>; // socketId -> student
  teacherSocketId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/session',
})
@Injectable()
export class SessionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SessionGateway.name);

  // In-memory storage for active sessions
  private activeSessions: Map<string, SessionRoom> = new Map(); // sessionCode -> SessionRoom
  private socketToSession: Map<string, string> = new Map(); // socketId -> sessionCode

  constructor(private readonly sessionService: SessionService) {}

  // Handle new client connections
  async handleConnection(socket: Socket) {
    this.logger.log(`Client connected: ${socket.id}`);
  }

  // Handle client disconnections
  async handleDisconnect(socket: Socket) {
    this.logger.log(`Client disconnected: ${socket.id}`);
    this.handleStudentDisconnect(socket.id);
  }

  @SubscribeMessage('join-session-as-teacher')
  async handleJoinAsTeacher(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { sessionCode: number; teacherId: string },
  ) {
    try {
      const { sessionCode, teacherId } = data;

      // Find session in database to verify it exists
      const session = await this.sessionService.getSessionByCode(sessionCode);
      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      // Create or get session room
      if (!this.activeSessions.has(sessionCode.toString())) {
        this.activeSessions.set(sessionCode.toString(), {
          sessionId: session._id.toString(),
          sessionCode,
          students: new Map(),
        });
      }

      const sessionRoom = this.activeSessions.get(sessionCode.toString());
      if (!sessionRoom) {
        throw new NotFoundException('Quiz topilmadi! (bad gateway)');
      }
      sessionRoom.teacherSocketId = socket.id;

      // Join socket room
      socket.join(sessionCode.toString());
      this.socketToSession.set(socket.id, sessionCode.toString());

      // Send current student list to teacher
      socket.emit('students-list-updated', {
        students: Array.from(sessionRoom.students.values()),
      });

      this.logger.log(`Teacher ${teacherId} joined session ${sessionCode}`);
    } catch (error) {
      this.logger.error('Error joining as teacher:', error);
      socket.emit('error', { message: 'Failed to join session' });
    }
  }

  @SubscribeMessage('join-session-as-student')
  async handleJoinAsStudent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { sessionCode: number; userName: string },
  ) {
    try {
      const { sessionCode, userName } = data;

      // Use your existing service to join student (creates user and adds to session)
      const result = await this.sessionService.joinStudentToSessionByCode({
        code: sessionCode,
        userName: userName,
      });

      const { token, createdStudent, foundSession } = result;

      // Create or get session room
      if (!this.activeSessions.has(sessionCode.toString())) {
        this.activeSessions.set(sessionCode.toString(), {
          sessionId: foundSession._id.toString(),
          sessionCode,
          students: new Map(),
        });
      }

      const sessionRoom = this.activeSessions.get(sessionCode.toString());

      // Add student to session room
      const connectedStudent: ConnectedStudent = {
        userId: createdStudent._id.toString(),
        socketId: socket.id,
        userName: createdStudent.fullName,
        joinedAt: new Date(),
      };
      if (!sessionRoom) {
        throw new NotFoundException('Quiz topilmadi! (bad gateway)');
      }

      sessionRoom.students.set(socket.id, connectedStudent);

      // Join socket room
      socket.join(sessionCode.toString());
      this.socketToSession.set(socket.id, sessionCode.toString());

      // Notify all clients in the session about updated student list
      this.server.to(sessionCode.toString()).emit('students-list-updated', {
        students: Array.from(sessionRoom.students.values()),
      });

      // Send success response to student with token
      socket.emit('join-success', {
        token,
        student: createdStudent,
        session: foundSession,
      });

      this.logger.log(`Student ${userName} joined session ${sessionCode}`);
    } catch (error) {
      this.logger.error('Error joining as student:', error);
      socket.emit('error', { message: error.message || 'Failed to join session' });
    }
  }

  @SubscribeMessage('start-quiz')
  async handleStartQuiz(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { sessionCode: number },
  ) {
    try {
      const { sessionCode } = data;
      const sessionRoom = this.activeSessions.get(sessionCode.toString());

      if (!sessionRoom) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      // Update session in database
      const session = await this.sessionService.getSessionById(
        new Types.ObjectId(sessionRoom.sessionId),
      );
      if (!session) {
        throw new NotFoundException('Quiz topilmadi! (bad gateway)');
      }
      session.isStarted = true;
      await session.save();

      // Notify all students that quiz has started
      this.server.to(sessionCode.toString()).emit('quiz-started', {
        message: 'Quiz has started!',
        startedAt: new Date(),
        sessionId: sessionRoom.sessionId,
      });

      this.logger.log(`Quiz started for session ${sessionCode}`);
    } catch (error) {
      this.logger.error('Error starting quiz:', error);
      socket.emit('error', { message: 'Failed to start quiz' });
    }
  }

  @SubscribeMessage('get-students-list')
  async handleGetStudentsList(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { sessionCode: number },
  ) {
    try {
      const { sessionCode } = data;
      const sessionRoom = this.activeSessions.get(sessionCode.toString());

      if (sessionRoom) {
        socket.emit('students-list-updated', {
          students: Array.from(sessionRoom.students.values()),
        });
      }
    } catch (error) {
      this.logger.error('Error getting students list:', error);
      socket.emit('error', { message: 'Failed to get students list' });
    }
  }

  private handleStudentDisconnect(socketId: string) {
    const sessionCode = this.socketToSession.get(socketId);
    if (!sessionCode) return;

    const sessionRoom = this.activeSessions.get(sessionCode);
    if (sessionRoom) {
      // Remove student from session room
      sessionRoom.students.delete(socketId);

      // Notify remaining clients about updated student list
      this.server.to(sessionCode).emit('students-list-updated', {
        students: Array.from(sessionRoom.students.values()),
      });

      // Clean up empty sessions
      if (sessionRoom.students.size === 0 && !sessionRoom.teacherSocketId) {
        this.activeSessions.delete(sessionCode);
      }
    }

    this.socketToSession.delete(socketId);
  }

  // Helper method to get session by code (you might want to add this to your service)
  async getSessionByCode(code: number) {
    // You'll need to add this method to your SessionService
    return await this.sessionService.getSessionByCode(code);
  }
}
