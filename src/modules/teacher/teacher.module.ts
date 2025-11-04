import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeacherModelDef } from './entity';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/common/config';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';

@Module({
  imports: [
    MongooseModule.forFeature([TeacherModelDef]),
    JwtModule.register({
      global: true,
      secret: config.JWT_SECRET_KEY,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule { }
