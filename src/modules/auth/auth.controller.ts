import { Body, Controller, Post, Put } from '@nestjs/common';
import { TeacherService } from '../teacher/teacher.service';
import { CONTROLLERS_NAME } from 'src/common/controllers-name';
import { CreateTeacherDto } from '../teacher/dto/create-teacher.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly authService: AuthService,
  ) {}

  @Post('teacher')
  [CONTROLLERS_NAME.signUpTeacher](@Body() data: CreateTeacherDto) {
    return this.teacherService.signUpTeacher(data);
  }

  @Put('teacher')
  [CONTROLLERS_NAME.signInTeacher](@Body() data: { phoneNumber: string; password: string }) {
    return this.authService.signInTeacher(data);
  }
}
