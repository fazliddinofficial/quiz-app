import { HydratedDocument } from 'mongoose';
import { Teacher } from '../entity';

export type TeacherOutputType = {
  teacher: Teacher;
  token: string;
};
