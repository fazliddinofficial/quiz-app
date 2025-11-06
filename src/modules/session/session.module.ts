import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionModelDef } from './entity';
import { QuizModelDef } from '../quiz/entity';
import { TeacherModelDef } from '../teacher/entity';
import { SessionService } from './session.service';
import { UserService } from '../user/user.service';
import { UserModelDef } from '../user/entity';
import { SessionController } from './session.controller';
import { SessionGateway } from './session.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([SessionModelDef, QuizModelDef, TeacherModelDef, UserModelDef]),
  ],
  providers: [SessionGateway, SessionService, UserService],
  controllers: [SessionController],
  exports: [SessionGateway, SessionService],
})
export class SessionModule {}
