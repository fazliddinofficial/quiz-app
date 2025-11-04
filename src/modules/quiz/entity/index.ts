import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Quiz {
  @Prop({
    type: String,
  })
  title: string;

  @Prop({
    type: [Types.ObjectId],
    ref: 'Question',
  })
  questions: string[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

export const QuizModelDef: ModelDefinition = {
  name: Quiz.name,
  schema: QuizSchema,
};
