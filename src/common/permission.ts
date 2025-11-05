import { CONTROLLERS_NAME } from './controllers-name';
import { PermissionsSetType } from './types';

const { signInTeacher, signUpTeacher, updateTeacherById, createQuestion, createQuiz } =
  CONTROLLERS_NAME;

export const PERMISSIONS: PermissionsSetType = {
  teacher: new Set([updateTeacherById, createQuestion, createQuiz]),
  student: new Set([]),
  whiteList: new Set([signInTeacher, signUpTeacher]),
};
