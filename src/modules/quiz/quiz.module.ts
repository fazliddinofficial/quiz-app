import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizModelDef } from './entity';
import { QuizService } from './quiz.service';
import { TeacherModelDef } from '../teacher/entity';
import { QuizController } from './quiz.controller';

@Module({
  imports: [MongooseModule.forFeature([QuizModelDef, TeacherModelDef])],
  providers: [QuizService],
  controllers: [QuizController],
})
export class QuizModule {}
