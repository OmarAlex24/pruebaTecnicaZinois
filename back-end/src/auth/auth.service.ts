import {
  ConsoleLogger,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from 'encryption.service';
import { ResponseUsuarioDto } from 'src/usuario/dto/response-usuario.dto';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsuarioService,
    private jwtService: JwtService,
    private encryptionService: EncryptionService,
  ) {}

  async validateUser(
    email: string,
    plainPass: string,
  ): Promise<ResponseUsuarioDto> {
    Logger.log('Finding user by email');
    const { password, ...userWithoutPassword } =
      await this.usersService.findOneByEmail(email);

    if (!userWithoutPassword) {
      throw new UnauthorizedException('Invalid password or email');
    }
    Logger.log('User found');
    Logger.log('Validating password');
    const isPasswordValid = await this.encryptionService.comparePassword(
      plainPass,
      password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password or email');
    }
    Logger.log('Password is valid');
    return userWithoutPassword as ResponseUsuarioDto;
  }

  async login(user: Usuario) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
