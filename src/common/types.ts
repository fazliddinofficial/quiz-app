export interface IConfig {
  PORT: number;
  DB_URL: string;
}

export enum UserRoleEnum {
  student = 'student',
  teacher = 'teacher'
}