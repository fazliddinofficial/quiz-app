import { Body, Controller, NotFoundException, Post, Req } from '@nestjs/common';
import { CONTROLLERS_NAME } from 'src/common/controllers-name';
import { UseAuthGuard } from 'src/common/guard';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Teacher } from '../teacher/entity';
import { Model } from 'mongoose';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService, @InjectModel(Teacher.name) private readonly TeacherModel: Model<Teacher>) { }

  @Post()
  @UseAuthGuard()
  async [CONTROLLERS_NAME.createQuiz](@Body() data: CreateQuizDto, @Req() req: Request) {
    const currentTeacherId = req['userId'];

    const foundUser = await this.TeacherModel.findById(currentTeacherId);

    if (!foundUser) {
      throw new NotFoundException("Foydalanuvchi topilmadi! Ro'yhatdan qaytadan o'ting!")
    }

    return this.quizService.createQuiz(data, currentTeacherId);
  }
}
