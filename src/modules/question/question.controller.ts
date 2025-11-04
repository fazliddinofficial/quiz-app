import { Body, Controller, Post } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CONTROLLERS_NAME } from 'src/common/controllers-name';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UseAuthGuard } from 'src/common/guard';

@Controller('question')
export class QuestionController {
  constructor(private readonly QuestionService: QuestionService) {}

  @Post()
  @UseAuthGuard()
  [CONTROLLERS_NAME.createQuestion](@Body() data: CreateQuestionDto) {
    return this.QuestionService.createQuestion(data);
  }
}
