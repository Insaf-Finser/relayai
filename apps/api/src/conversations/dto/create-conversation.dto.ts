import {
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateConversationDto {
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  subject!: string;
}