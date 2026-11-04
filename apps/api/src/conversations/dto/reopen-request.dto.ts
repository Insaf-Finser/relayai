import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class ReopenRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  message!: string;
}