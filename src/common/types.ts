import { Types } from 'mongoose';

export interface IConfig {
  PORT: number;
  DB_URL: string;
  JWT_SECRET_KEY: string;
}

export enum UserRoleEnum {
  student = 'student',
  teacher = 'teacher',
}

export type JwtPayload = {
  phoneNumber: string;
  role: UserRoleEnum;
  userId: Types.ObjectId;
};
