import { 
    Injectable,
    ConflictException,
    UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '../generated/prisma/client.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma:PrismaService,
        private readonly jwt:JwtService
    ){}

    async register(dto: RegisterDto){
        const passwordHash = await bcrypt.hash(dto.password , 12);

        try{
            const user = await this.prisma.user.create({
                data:{
                    name:dto.name,
                    email:dto.email,
                    passwordHash,
                    role: "CUSTOMER"
                },
                select:{
                    id:true,
                    name:true,
                    email:true,
                    role:true,
                    createdAt:true,
                },
            });

            return user;
        }catch(error){
            if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"){
                throw new ConflictException("An Account with this email already exists !!");
            }

            throw error;
        }
    }

    async login(dto:LoginDto){
        const user =await this.prisma.user.findUnique({
            where:{email:dto.email.trim().toLowerCase()},
        });

        if(!user || !user.passwordHash || !(await bcrypt.compare(dto.password,user.passwordHash))){
            throw new UnauthorizedException("Invalid Email or Password");
        }

        const accessToken = await this.jwt.signAsync({
            sub:user.id,
            role:user.role,
        })

        return {
            accessToken,
            tokenType:'Bearer',
            expiresIn: 900,
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role,
            } ,
        };
    }
}
