import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizModelDef } from './entity';
import { QuizService } from './quiz.service';

@Module({
  imports: [MongooseModule.forFeature([QuizModelDef])],
  providers: [QuizService],
})
export class QuizModule {}
