import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { Session } from './entity';
import { Teacher } from '../teacher/entity';
import { Quiz } from '../quiz/entity';
import { UserService } from '../user/user.service';
import { JwtPayload } from 'src/common/types';
import { JwtService } from '@nestjs/jwt';
import { JoinStudentToSessionDto } from './dto/create-session.dto';
import { User } from '../user/entity';
import { EventsGateway } from 'src/events/events.gateway';
import { Question } from '../question/entity';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private readonly SessionModel: Model<Session>,
    @InjectModel(Teacher.name) private readonly TeacherModel: Model<Teacher>,
    @InjectModel(Quiz.name) private readonly QuizModel: Model<Quiz>,
    @InjectModel(Question.name) private readonly QuestionModel: Model<Question>,
    private readonly UserService: UserService,
    private readonly JwtService: JwtService,
    private readonly eventsGateWay: EventsGateway,
  ) {}
  @WebSocketServer()
  server: Server;

  async createSession(teacherId: string, quizId: string = '') {
    const foundSession = await this.SessionModel.findOne({ quizId, isActive: true });
    if (foundSession) {
      return foundSession;
    }

    const expiresAt = new Date();

    let foundQuiz: any;
    let minutes: number;

    if (quizId === '') {
      foundQuiz = await this.QuizModel.find().sort({ createdAt: -1 }).limit(1).lean().exec();
      minutes = foundQuiz[0].questions.length + 1;
    } else {
      foundQuiz = await this.QuizModel.findById(quizId).lean().exec();
      minutes = foundQuiz.questions.length + 1;
    }
    if (!foundQuiz) {
      throw new NotFoundException('Quiz topilmadi!');
    }

    expiresAt.setMinutes(expiresAt.getMinutes() + minutes);

    const code = new Date().getTime().toString().slice(-6);

    const createdSession = await this.SessionModel.create({
      duration: expiresAt,
      teacherId,
      quizId,
      code,
    });

    return { sessionId: createdSession._id, code: createdSession.code, success: true };
  }

  async deactivateSession(sessionId) {
    const foundSession = await this.SessionModel.findByIdAndUpdate(
      sessionId,
      { isActive: false, isStarted: false },
      { new: true },
    );

    if (!foundSession) {
      throw new NotFoundException('Quiz topilmadi!');
    }

    return { message: 'Quiz tugadi!', foundSession };
  }

  async markCorrectAnswer({
    userId,
    questionId,
    sessionId,
  }: {
    userId: string;
    questionId: string;
    sessionId: string;
  }) {}

  async joinStudentToSessionByCode({ code, userName, uniqueCode }: JoinStudentToSessionDto) {
    code = Number(code);

    const foundSession = await this.SessionModel.findOne({ code })
      .populate<{ students: User[] }>('students')
      .exec();

    if (!foundSession) {
      throw new NotFoundException('Quiz topilmadi!');
    }

    const createdStudent = await this.UserService.createUser({ fullName: userName, uniqueCode });

    foundSession?.students.push(createdStudent);
    await foundSession?.save();

    const jwtPayload: JwtPayload = {
      role: createdStudent.role,
      userId: createdStudent._id,
    };

    const token = this.JwtService.sign(jwtPayload);

    this.eventsGateWay.notifyStudentJoined(String(foundSession._id), createdStudent.fullName);

    return { token, foundSession: foundSession._id, uniqueCode };
  }

  async getSessionById(sessionId: Types.ObjectId) {
    const foundSession = await this.SessionModel.findById(sessionId).populate<{ students: User[] }>(
      'students',
    );
    const studentsNameArray = foundSession?.students.map((value) => value.fullName);
    return { studentsNameArray };
  }

  async getSessionByCode(code: number) {
    return await this.SessionModel.findOne({ code }).populate('students').exec();
  }

  async updateSessionStudents(sessionId: string) {
    const session = await this.SessionModel.findById(sessionId);
    if (!session) {
      throw new NotFoundException('Session topilmadi!');
    }
    this.eventsGateWay.notifyStudentsUpdated(sessionId, session?.students);
  }

  async getAllStudentsList(sessionId: Types.ObjectId) {
    const foundSession = await this.SessionModel.findById(sessionId);

    if (!foundSession) {
      throw new NotFoundException('Quiz topilmadi!(session)');
    }

    return foundSession.students.map((v) => {
      return v.fullName;
    });
  }

  async startSessionById(sessionId: string) {
    const foundSession = await this.SessionModel.findById(sessionId);
    if (!foundSession) {
      throw new NotFoundException('Quiz topilmadi (Session topilmadi)');
    }

    const foundQuiz = await this.QuizModel.findById(foundSession.quizId).populate<{
      questions: Question[];
    }>('questions');

    this.eventsGateWay.emitToSession(sessionId, 'quizStarted', foundSession?.duration);

    console.log('heeee');

    this.startSendingQuestion(sessionId, 0);

    return foundQuiz;
  }

  async startSendingQuestion(sessionId: string, questionIndex: number = 0) {
    const session = await this.SessionModel.findById(sessionId).populate<{ quizId: Quiz }>(
      'quizId',
    );

    const questions = session?.quizId.questions;

    if (!questions?.length) {
      throw new NotFoundException('Savollar topilmadi');
    }

    const foundQuestion = await this.QuestionModel.findById(questions[questionIndex]);

    if (!foundQuestion) {
      throw new NotFoundException('not found');
    }

    return foundQuestion;
  }

  async handleStart(sessionId: string) {
    const foundSession = await this.SessionModel.findById(sessionId);

    this.eventsGateWay.emitToSession(sessionId, 'quizStarted', foundSession?.duration);

    return foundSession?.duration;
  }
}
