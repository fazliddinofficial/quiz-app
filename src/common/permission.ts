import { CONTROLLERS_NAME } from './controllers-name';
import { PermissionsSetType } from './types';

const {
  signInTeacher,
  signUpTeacher,
  updateTeacherById
} = CONTROLLERS_NAME;

export const PERMISSIONS: PermissionsSetType = {
  teacher: new Set([
    updateTeacherById
  ]),
  student: new Set([

  ]),
  whiteList: new Set([
    signInTeacher,
    signUpTeacher
  ]),
};
