import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { QuizTypeEnum } from 'src/common/types';
import { Question } from 'src/modules/question/entity';

@Schema({ versionKey: false, timestamps: true })
export class Quiz {
  @Prop({
    type: String,
  })
  title: string;

  @Prop({
    type: [Types.ObjectId],
    ref: Question.name,
  })
  questions: string[];

  @Prop({
    type: String,
    enum: Object.keys(QuizTypeEnum),
    required: true,
  })
  quizType: QuizTypeEnum;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

export const QuizModelDef: ModelDefinition = {
  name: Quiz.name,
  schema: QuizSchema,
};
