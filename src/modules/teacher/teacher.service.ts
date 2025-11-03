import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Teacher } from './entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { createHash } from 'src/common/bcrypt';
import { JwtPayload } from 'src/common/types';
import { CreatedTeacherOutputType } from './output/created-teacher.output';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name) private readonly TeacherModel: Model<Teacher>,
    private jwtService: JwtService,
  ) {}

  async signUpTeacher({
    firstName,
    lastName,
    password,
    phoneNumber,
  }: CreateTeacherDto): Promise<CreatedTeacherOutputType> {
    const isPhoneNumberUnique = await this.TeacherModel.findOne({ phoneNumber: phoneNumber });

    if (isPhoneNumberUnique) {
      throw new BadRequestException('Teacher is already exist with this phone number!');
    }

    const hash = await createHash(password);

    const createdTeacher = await this.TeacherModel.create({
      firstName,
      lastName,
      password: hash,
      phoneNumber,
    });

    const payload: JwtPayload = {
      phoneNumber: phoneNumber,
      role: createdTeacher.role,
      userId: createdTeacher._id,
    };

    const token = this.jwtService.sign(payload);

    return { createdTeacher, token };
  }
}
