import {Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly service:AuthService){}

    @Post("register")
    register(@Body() dto:RegisterDto){
        return this.service.register(dto);
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    login(@Body() dto:LoginDto){
        return this.service.login(dto);
    }
}
