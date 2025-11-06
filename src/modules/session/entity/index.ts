import { Type } from '@nestjs/common';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/modules/user/entity';

@Schema({ versionKey: false, timestamps: true })
export class Session {
  @Prop({
    type: [Types.ObjectId],
    ref: 'User',
  })
  students: User[] | Types.ObjectId[];

  @Prop({
    type: Types.ObjectId,
    ref: 'Quiz',
    required: true,
  })
  quizId: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'Teacher',
  })
  teacherId: string;

  @Prop({
    type: Date,
    required: true,
  })
  duration: Date;

  @Prop({
    type: Number,
  })
  code: number;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  isStarted: boolean;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

export const SessionModelDef: ModelDefinition = {
  name: Session.name,
  schema: SessionSchema,
};
