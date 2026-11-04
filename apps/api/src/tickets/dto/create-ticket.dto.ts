import {
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateTicketDto {
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  subject!: string;

  @IsString()
  @MinLength(5)
  @MaxLength(5000)
  description!: string;
}