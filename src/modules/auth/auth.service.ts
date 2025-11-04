import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Teacher } from '../teacher/entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'src/common/bcrypt';
import { JwtPayload } from 'src/common/types';
import { TeacherOutputType } from '../teacher/output/created-teacher.output';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Teacher.name) private readonly TeacherModel: Model<Teacher>,
    private jwtService: JwtService,
  ) {}

  async signInTeacher({
    phoneNumber,
    password,
  }: {
    phoneNumber: string;
    password: string;
  }): Promise<TeacherOutputType> {
    const foundTeacher = await this.TeacherModel.findOne({ phoneNumber }).lean().exec();

    if (!foundTeacher) {
      throw new NotFoundException('Teacher not found with this phone!');
    }

    const isPasswordCorrect = await compare({ hash: foundTeacher.password, plainText: password });

    if (!isPasswordCorrect) {
      throw new BadRequestException('Password is not correct!');
    }

    const payload: JwtPayload = {
      phoneNumber: phoneNumber,
      role: foundTeacher.role,
      userId: foundTeacher._id,
    };

    const token = this.jwtService.sign(payload);

    return { token, teacher: foundTeacher };
  }
}
