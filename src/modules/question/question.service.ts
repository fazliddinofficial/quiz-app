import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Question } from "./entity";
import { Model } from "mongoose";
import { CreateQuestionDto } from "./dto/create-question.dto";

@Injectable()
export class QuestionService {
  constructor(@InjectModel(Question.name) private readonly QuestionModel: Model<Question>) { }

  async createQuestion(data: CreateQuestionDto) {

  }
}