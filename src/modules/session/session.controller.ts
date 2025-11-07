import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { SessionService } from './session.service';
import { CONTROLLERS_NAME } from 'src/common/controllers-name';
import { UseAuthGuard } from 'src/common/guard';
import { JoinStudentToSessionDto } from './dto/create-session.dto';
import { Types } from 'mongoose';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) { }

  @UseAuthGuard()
  @Post('quiz')
  [CONTROLLERS_NAME.createSession](@Body() data: { quizId?: string }, @Req() req: Request) {
    return this.sessionService.createSession(req['userId'], data.quizId);
  }

  @UseAuthGuard()
  @Put('de-active-session')
  [CONTROLLERS_NAME.deactivateSession](@Body() sessionId: Types.ObjectId) {
    return this.sessionService.deactivateSession(sessionId);
  }

  @UseAuthGuard()
  @Post('join')
  [CONTROLLERS_NAME.joinStudentToSessionByCode](@Body() data: JoinStudentToSessionDto) {
    return this.sessionService.joinStudentToSessionByCode(data);
  }

  @Get(':id')
  @UseAuthGuard()
  [CONTROLLERS_NAME.getSessionById](@Param('id') id: Types.ObjectId) {
    return this.sessionService.getSessionById(id);
  }

  @Get(':id/students')
  @UseAuthGuard()
  [CONTROLLERS_NAME.getAllStudentsList](@Param('id') id: Types.ObjectId) {
    return this.sessionService.getAllStudentsList(id);
  }
}
