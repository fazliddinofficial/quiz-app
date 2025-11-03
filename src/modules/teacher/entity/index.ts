import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UserRoleEnum } from 'src/common/types';

@Schema({ versionKey: false, timestamps: true })
export class Teacher {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: String,
    enum: Object.keys(UserRoleEnum),
    default: UserRoleEnum.teacher,
  })
  role: UserRoleEnum;

  @Prop({ type: String, required: true })
  phoneNumber: string;

  @Prop({
    type: [Types.ObjectId],
    ref: 'Quiz',
  })
  createdQuizzes: string[];
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);

export const TeacherModelDef: ModelDefinition = {
  name: Teacher.name,
  schema: TeacherSchema,
};
