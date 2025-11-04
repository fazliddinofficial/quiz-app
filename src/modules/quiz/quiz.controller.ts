import { Body, Controller, Post, Req } from "@nestjs/common";
import { CONTROLLERS_NAME } from "src/common/controllers-name";
import { UseAuthGuard } from "src/common/guard";
import { QuizService } from "./quiz.service";
import { CreateQuizDto } from "./dto/create-quiz.dto";

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) { }

  @Post()
  @UseAuthGuard()
  [CONTROLLERS_NAME.createQuiz](@Body() data: CreateQuizDto, @Req() req: Request) {
    const currentTeacherId = req['userId']
    return this.quizService.createQuiz(data, currentTeacherId);
  }
}