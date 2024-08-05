import { Role } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthBody {
    @IsEmail()
    @IsNotEmpty({ message: 'Email é obrigatório' })
    email: string;

    @IsString({ message: 'Senha inválida' })
    @IsNotEmpty({ message: 'Senha é obrigatória' })
    password: string;
  }

export class PayLoadData {
    id: string;
    email: string;
    role: Role;
}