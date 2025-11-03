import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './common/config';

@Module({
  imports: [MongooseModule.forRoot(config.DB_URL), UserModule, TeacherModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
