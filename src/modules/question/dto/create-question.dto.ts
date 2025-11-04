import { IsNotEmpty, IsString } from "class-validator";

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  variants: string[];

  @IsString()
  @IsNotEmpty()
  correctAnswer: string
}