import { IsNotEmpty, IsString } from "class-validator";

export class CreateQuizDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  quizType: string;

  questions: string[]
}