import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  Logger,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SuccessResponse } from 'src/response/success-response.dto';
import { ResponseUsuarioDto } from './dto/response-usuario.dto';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  getAllUsers(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/deleted')
  getAllUsersIncludingDeleted(): Promise<Usuario[]> {
    return this.usuarioService.findAllIncludingDeleted();
  }

  @Post('/create-user')
  async createUser(
    @Body() userDto: CreateUsuarioDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.usuarioService.create(userDto);

    const access_token = response.data.access_token;

    Logger.log(`Usuario creado: ${access_token}`);

    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 3600000,
      sameSite: 'strict',
    });
    return response.data.usuario;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usuarioService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(id);
  }
}
