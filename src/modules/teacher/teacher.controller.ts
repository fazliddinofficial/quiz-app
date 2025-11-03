import { Body, Controller, Post, Put } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CONTROLLERS_NAME } from 'src/common/controllers-name';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Put()
  [CONTROLLERS_NAME.updateTeacherById]() {
    return 'update teacher handler';
  }
}
