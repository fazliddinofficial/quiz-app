import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UserRoleEnum } from 'src/common/types';

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
  })
  fullName: string;

  @Prop({
    type: String,
    enum: Object.keys(UserRoleEnum),
    default: UserRoleEnum.student,
  })
  role: UserRoleEnum;

  @Prop({
    type: [Types.ObjectId],
    default: [],
    ref: 'Answer'
  })
  answers: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserModelDef: ModelDefinition = {
  name: User.name,
  schema: UserSchema,
};
