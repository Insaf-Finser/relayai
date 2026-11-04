import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export enum CreateUserRole {
  CUSTOMER = "CUSTOMER",
  AGENT = "AGENT",
  ADMIN = "ADMIN",
}

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsOptional()
  @IsEnum(CreateUserRole)
  role?: CreateUserRole;
}