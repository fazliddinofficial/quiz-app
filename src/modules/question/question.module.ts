import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionModelDef } from './entity';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { QuizModelDef } from '../quiz/entity';

@Module({
  imports: [MongooseModule.forFeature([QuestionModelDef, QuizModelDef])],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
