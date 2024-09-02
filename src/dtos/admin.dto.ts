import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AdminDto { 
  @IsEmail()
  @IsNotEmpty()
  email: string
}