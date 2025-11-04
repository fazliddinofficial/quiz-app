import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz } from './entity';
import { Model } from 'mongoose';

@Injectable()
export class QuizService {
  constructor(@InjectModel(Quiz.name) private readonly QuizModel: Model<Quiz>) {}

  async createQuiz() {}
}
