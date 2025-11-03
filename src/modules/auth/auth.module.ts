import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeacherModelDef } from '../teacher/entity';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/common/config';
import { AuthController } from './auth.controller';
import { TeacherService } from '../teacher/teacher.service';

@Module({
  imports: [
    MongooseModule.forFeature([TeacherModelDef]),
    JwtModule.register({
      global: true,
      secret: config.JWT_SECRET_KEY,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  controllers: [AuthController],
  providers: [TeacherService],
})
export class AuthModule {}
