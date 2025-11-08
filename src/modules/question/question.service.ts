import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './entity';
import { Model } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Quiz } from '../quiz/entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private readonly QuestionModel: Model<Question>,
    @InjectModel(Quiz.name) private readonly QuizModel: Model<Quiz>,
  ) {}

  async createQuestion({ quizId, ...data }: CreateQuestionDto) {
    const foundQuiz = await this.QuizModel.findById(quizId);

    if (!foundQuiz) {
      throw new NotFoundException('Quiz not found');
    }

    const indexOfQuestion = (await this.QuestionModel.find()).length;

    const createdQuestion = await this.QuestionModel.create({
      ...data,
      questionIndex: indexOfQuestion + 1,
    });

    foundQuiz.questions.push(String(createdQuestion._id));
    await foundQuiz.save();

    return createdQuestion;
  }
}
