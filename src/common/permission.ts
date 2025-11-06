import { CONTROLLERS_NAME } from './controllers-name';
import { PermissionsSetType } from './types';

const {
  signInTeacher,
  signUpTeacher,
  updateTeacherById,
  createQuestion,
  createQuiz,
  createSession,
  deactivateSession,
  joinStudentToSessionByCode,
  getSessionById,
} = CONTROLLERS_NAME;

export const PERMISSIONS: PermissionsSetType = {
  teacher: new Set([
    updateTeacherById,
    getSessionById,
    createQuestion,
    createQuiz,
    deactivateSession,
    createSession,
  ]),
  student: new Set([getSessionById]),
  whiteList: new Set([signInTeacher, signUpTeacher, joinStudentToSessionByCode]),
};
