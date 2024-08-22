import {
  Request,
  Controller,
  UseGuards,
  Get,
  Logger,
  Res,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.login(req.user);
    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 3600000,
    });
    return { message: 'Logged in successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    Logger.log('Getting user profile');
    return req.user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Logged out successfully' };
  }
}
