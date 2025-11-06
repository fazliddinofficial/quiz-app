import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private readonly SessionModel: Model<Session>,
    @InjectModel(Teacher.name) private readonly TeacherModel: Model<Teacher>,
    @InjectModel(Quiz.name) private readonly QuizModel: Model<Quiz>,
    private readonly UserService: UserService,
    private readonly JwtService: JwtService,
    private readonly eventsGateWay: EventsGateway,
  ) { }

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

    return createdSession;
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
  }) { }

  async joinStudentToSessionByCode({ code, userName }: JoinStudentToSessionDto) {
    code = Number(code);
    const foundSession = await this.SessionModel.findOne({ code })
      .populate<{ students: User[] }>('students').exec();
    if (!foundSession) {
      throw new NotFoundException('Quiz topilmadi!');
    }

    const createdStudent = await this.UserService.createUser({ fullName: userName });

    foundSession?.students.push(createdStudent);
    await foundSession?.save();

    const jwtPayload: JwtPayload = {
      role: createdStudent.role,
      userId: createdStudent._id,
    };

    const token = this.JwtService.sign(jwtPayload);

    this.eventsGateWay.notifyStudentJoined(String(foundSession._id), createdStudent._id);

    return { token, foundSession: foundSession._id };
  }

  async getSessionById(sessionId: Types.ObjectId) {
    const foundSession = await this.SessionModel.findById(sessionId).populate<{ students: User[] }>('students');
    const studentsNameArray = foundSession?.students.map((value) => value.fullName)
    return { studentsNameArray }
  }

  async getSessionByCode(code: number) {
    return await this.SessionModel.findOne({ code }).populate('students').exec();
  }

  async updateSessionStudents(sessionId: string) {
    const session = await this.SessionModel.findById(sessionId);
    if (!session) {
      throw new NotFoundException('Session topilmadi!')
    }
    this.eventsGateWay.notifyStudentsUpdated(sessionId, session?.students);
  }
}
