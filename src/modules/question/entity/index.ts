import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Quiz } from "src/modules/quiz/entity";

@Schema({ versionKey: false, timestamps: true })
export class Question {
  @Prop({
    type: String,
    required: true,
  })
  text: string;

  @Prop({
    type: [String]
  })
  variants: string[];

  @Prop({
    type: String,
    required: true,
  })
  correctAnswer: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

export const QuestionModelDef: ModelDefinition = {
  name: Quiz.name,
  schema: QuestionSchema,
}