import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionModelDef } from './entity';
import { QuizModelDef } from '../quiz/entity';
import { TeacherModelDef } from '../teacher/entity';
import { SessionService } from './session.service';
import { UserService } from '../user/user.service';
import { UserModelDef } from '../user/entity';
import { SessionController } from './session.controller';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([SessionModelDef, QuizModelDef, TeacherModelDef, UserModelDef]),
  ],
  providers: [SessionService, UserService, EventsGateway],
  controllers: [SessionController],
  exports: [SessionService],
})
export class SessionModule {}
