import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type AnswerDocument = Answer & Document;

@Schema({ timestamps: true, versionKey: false })
export class Answer {
  @Prop({
    type: Types.ObjectId,
    ref: "User"
  })
  studentId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Session'
  })
  sessionId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Question'
  })
  question: Types.ObjectId;

  @Prop({
    type: Object
  })
  selectedOption?: Record<string, string | Types.ObjectId>;

  score?: number;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

export const AnswerModelDef: ModelDefinition = {
  name: Answer.name,
  schema: AnswerSchema
}

AnswerSchema.index({ sessionId: 1, studentId: 1 });
AnswerSchema.index({ quizId: 1, questionId: 1 });
AnswerSchema.index({ studentId: 1, answeredAt: -1 });