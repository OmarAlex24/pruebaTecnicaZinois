import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from 'encryption.service';
import { ResponseUsuarioDto } from 'src/usuario/dto/response-usuario.dto';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsuarioService))
    private readonly usersService: UsuarioService,
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

  async login(user: ResponseUsuarioDto) {
    Logger.log('Generating payload for token');
    const payload = { email: user.email, sub: user.id };
    Logger.log('Payload generated');
    Logger.log('Signing token');
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
