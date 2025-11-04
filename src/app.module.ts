import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './common/config';
import { AuthModule } from './modules/auth/auth.module';
import { QuizModule } from './modules/quiz/quiz.module';

@Module({
  imports: [
    MongooseModule.forRoot(config.DB_URL),
    UserModule,
    TeacherModule,
    AuthModule,
    QuizModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
