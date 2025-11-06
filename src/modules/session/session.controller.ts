import { Body, Controller, Post, Req } from '@nestjs/common';
import { SessionService } from './session.service';
import { CONTROLLERS_NAME } from 'src/common/controllers-name';
import { UseAuthGuard } from 'src/common/guard';
import { CreateSessionDto, JoinStudentToSessionDto } from './dto/create-session.dto';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) { }

  @UseAuthGuard()
  @Post()
  [CONTROLLERS_NAME.createSession](@Body() quizId: string, @Req() req: Request) {
    return this.sessionService.createSession(quizId, req['userId']);
  }

  @UseAuthGuard()
  @Post()
  [CONTROLLERS_NAME.deactivateSession](@Body() sessionId: string) {
    return this.sessionService.deactivateSession(sessionId);
  }

  @UseAuthGuard()
  @Post()
  [CONTROLLERS_NAME.joinStudentToSessionByCode](@Body() data: JoinStudentToSessionDto) {
    return this.sessionService.joinStudentToSessionByCode(data);
  }
}
