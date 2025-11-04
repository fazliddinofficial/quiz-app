import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionModelDef } from './entity';

@Module({
  imports: [MongooseModule.forFeature([QuestionModelDef])],
})
export class QuestionModule {}
