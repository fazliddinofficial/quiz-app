import { Body, Controller, Post } from '@nestjs/common';
import { TeacherService } from '../teacher/teacher.service';
import { CONTROLLERS_NAME } from 'src/common/controllers-name';
import { CreateTeacherDto } from '../teacher/dto/create-teacher.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post('teacher')
  [CONTROLLERS_NAME.signUpTeacher](@Body() data: CreateTeacherDto) {
    return this.teacherService.signUpTeacher(data);
  }
}
