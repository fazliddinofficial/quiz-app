import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz } from './entity';
import { HydratedDocument, Model } from 'mongoose';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Teacher } from '../teacher/entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name) private readonly QuizModel: Model<Quiz>,
    @InjectModel(Teacher.name) private readonly TeacherModel: Model<Teacher>,
  ) {}

  async createQuiz(data: CreateQuizDto, teacherId: string): Promise<HydratedDocument<Quiz>> {
    const createdQuiz = await this.QuizModel.create(data);

    const foundTeacher = await this.TeacherModel.findById(teacherId);

    if (!foundTeacher) {
      throw new NotFoundException('Teacher not found in create quiz service!');
    }

    foundTeacher?.createdQuizzes.push(`${createdQuiz._id}`);
    await foundTeacher?.save();

    return createdQuiz;
  }
}
