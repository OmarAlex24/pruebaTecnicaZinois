import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SuccessResponse } from 'src/response/success-response.dto';
import { ResponseUsuarioDto } from './dto/response-usuario.dto';

@Controller('usuario')
@UseGuards(JwtAuthGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get('/')
  getAllUsers(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @Get('/deleted')
  getAllUsersIncludingDeleted(): Promise<Usuario[]> {
    return this.usuarioService.findAllIncludingDeleted();
  }

  @Post('/create-user')
  createUser(
    @Body() userDto: CreateUsuarioDto,
  ): Promise<SuccessResponse<{ usuario: ResponseUsuarioDto }>> {
    return this.usuarioService.create(userDto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usuarioService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(id);
  }
}
