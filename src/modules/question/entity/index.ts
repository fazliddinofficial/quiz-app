import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Question {
  @Prop({
    type: String,
    required: true,
  })
  text: string;

  @Prop({
    type: Object,
    required: true,
  })
  variants: Record<string, string>;

  @Prop({
    type: String,
    required: true,
  })
  correctAnswer: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Quiz',
  })
  quizId: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

export const QuestionModelDef: ModelDefinition = {
  name: Question.name,
  schema: QuestionSchema,
};
