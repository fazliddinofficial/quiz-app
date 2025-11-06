import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './common/config';
import { AuthModule } from './modules/auth/auth.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { QuestionModule } from './modules/question/question.module';
import { SessionModule } from './modules/session/session.module';
import { AnswerModule } from './modules/answer/answer.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    MongooseModule.forRoot(config.DB_URL),
    ScheduleModule.forRoot(),
    UserModule,
    TeacherModule,
    AuthModule,
    QuizModule,
    QuestionModule,
    SessionModule,
    AnswerModule,
    EventsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
