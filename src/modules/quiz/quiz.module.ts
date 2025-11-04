import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizModelDef } from './entity';
import { QuizService } from './quiz.service';
import { TeacherModelDef } from '../teacher/entity';

@Module({
  imports: [MongooseModule.forFeature([QuizModelDef, TeacherModelDef])],
  providers: [QuizService],
})
export class QuizModule { }
