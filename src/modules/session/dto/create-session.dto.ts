import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSessionDto {
  quizId: string;
}

export class JoinStudentToSessionDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  code: number;

  @IsNumber()
  @IsNotEmpty()
  uniqueCode: number;
}
