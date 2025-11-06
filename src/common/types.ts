import { Types } from 'mongoose';
import { CONTROLLERS_NAME } from './controllers-name';

export interface IConfig {
  PORT: number;
  DB_URL: string;
  JWT_SECRET_KEY: string;
  CLIENT_URL: string;
}

export enum UserRoleEnum {
  student = 'student',
  teacher = 'teacher',
  whiteList = 'whiteList',
}

export type JwtPayload = {
  phoneNumber?: string;
  role: UserRoleEnum;
  userId: Types.ObjectId;
};

export enum QuizTypeEnum {
  individual = 'individual',
  group = 'group',
}

export type HandlersKeys = keyof typeof CONTROLLERS_NAME;

export type PermissionsSetType = {
  [K in UserRoleEnum]: Set<string>;
};
