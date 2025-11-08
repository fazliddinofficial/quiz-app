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
  getAllStudentsList,
  startSessionById
} = CONTROLLERS_NAME;

export const PERMISSIONS: PermissionsSetType = {
  teacher: new Set([
    updateTeacherById,
    getSessionById,
    createQuestion,
    createQuiz,
    deactivateSession,
    createSession,
    getAllStudentsList,
    startSessionById
  ]),
  student: new Set([getSessionById, getAllStudentsList]),
  whiteList: new Set([signInTeacher, signUpTeacher, joinStudentToSessionByCode]),
};
