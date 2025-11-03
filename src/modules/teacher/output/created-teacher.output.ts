import { HydratedDocument } from 'mongoose';
import { Teacher } from '../entity';

export type CreatedTeacherOutputType = {
  createdTeacher: HydratedDocument<Teacher>;
  token: string;
};
