import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Session } from "./entity";
import { Teacher } from "../teacher/entity";
import { Quiz } from "../quiz/entity";
import { CreateSessionDto } from "./dto/create-session.dto";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private readonly SessionModel: Model<Session>,
    @InjectModel(Teacher.name) private readonly TeacherModel: Model<Teacher>,
    @InjectModel(Quiz.name) private readonly QuizModel: Model<Quiz>,
  ) { }

  async createSession({
    quizId,
    students,
  }: CreateSessionDto, teacherId: string) {
    const expiresAt = new Date();

    const foundQuiz = await this.QuizModel.findById(quizId).lean().exec();

    if (!foundQuiz) {
      throw new NotFoundException('Quiz topilmadi!')
    }
    const minutes = foundQuiz.questions.length;

    expiresAt.setMinutes(expiresAt.getMinutes() + minutes);

    const code = new Date().getTime().toString().slice(-6);

    const createdSession = await this.SessionModel.create({
      duration: expiresAt,
      teacherId,
      quizId,
      students,
      code
    });

    return createdSession;
  }

  async deactivateSession(sessionId: string) {
    const foundSession = await this.SessionModel.findByIdAndUpdate(sessionId, { isActive: true }, { new: true })

    if (!foundSession) {
      throw new NotFoundException('Quiz topilmadi!')
    }

    return { message: 'Quiz tugadi!' };
  }

  async markCorrectAnswer({ userId, questionId, sessionId }: { userId: string, questionId: string, sessionId: string }) {

  }
}