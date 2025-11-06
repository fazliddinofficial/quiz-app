import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from './entity';
import { Teacher } from '../teacher/entity';
import { Quiz } from '../quiz/entity';
import { UserService } from '../user/user.service';
import { JwtPayload } from 'src/common/types';
import { JwtService } from '@nestjs/jwt';
import { JoinStudentToSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private readonly SessionModel: Model<Session>,
    @InjectModel(Teacher.name) private readonly TeacherModel: Model<Teacher>,
    @InjectModel(Quiz.name) private readonly QuizModel: Model<Quiz>,
    private readonly UserService: UserService,
    private readonly JwtService: JwtService
  ) { }

  async createSession(quizId: string, teacherId: string) {
    const expiresAt = new Date();

    const foundQuiz = await this.QuizModel.findById(quizId).lean().exec();

    if (!foundQuiz) {
      throw new NotFoundException('Quiz topilmadi!');
    }
    const minutes = foundQuiz.questions.length;

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

  async deactivateSession(sessionId: string) {
    const foundSession = await this.SessionModel.findByIdAndUpdate(
      sessionId,
      { isActive: true },
      { new: true },
    );

    if (!foundSession) {
      throw new NotFoundException('Quiz topilmadi!');
    }

    return { message: 'Quiz tugadi!' };
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

  async joinStudentToSessionByCode({ code,
    userName
  }: JoinStudentToSessionDto) {
    const foundSession = await this.SessionModel.findOne({ code });

    if (!foundSession) {
      throw new NotFoundException('Quiz topilmadi!');
    }

    const createdStudent = await this.UserService.createUser({ fullName: userName })

    foundSession?.students.push(String(createdStudent._id));
    foundSession?.save();

    const jwtPayload: JwtPayload = {
      role: createdStudent.role,
      userId: createdStudent._id,
    }

    const token = this.JwtService.sign(jwtPayload);

    return { token, createdStudent, foundSession }
  }
}
