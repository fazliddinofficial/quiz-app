import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionModelDef } from './entity';
import { QuizModelDef } from '../quiz/entity';
import { TeacherModelDef } from '../teacher/entity';

@Module({
  imports: [MongooseModule.forFeature([SessionModelDef, QuizModelDef, TeacherModelDef])],
})
export class SessionModule {}
