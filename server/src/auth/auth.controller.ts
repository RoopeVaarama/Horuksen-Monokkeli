import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { Public } from './public.decorator';
//import { LoginDto, UserResponseObjDto } from '../user/user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from '../user/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto): Promise<any> {
    return await this.authService.login(loginDto);
  }

  @Get('/validateToken/:token')
  @Public()
  async validateToken(@Param() params): Promise<any> {
    return await this.authService.validateToken(params.token);
  }
}
