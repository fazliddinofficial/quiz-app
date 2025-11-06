import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSessionDto {
  quizId: string;
}

export class JoinStudentToSessionDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsNumber()
  @IsNotEmpty()
  code: number
}