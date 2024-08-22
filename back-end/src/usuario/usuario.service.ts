import {
  BadRequestException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { EncryptionService } from 'encryption.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { ResponseUsuarioDto } from './dto/response-usuario.dto';
import { isUUID } from 'class-validator';
import { SuccessResponse } from 'src/response/success-response.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private readonly encryptionService: EncryptionService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  getUserWithoutPass(user: Usuario): ResponseUsuarioDto {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as ResponseUsuarioDto;
  }
  async existsIncludingDeletedByEmail(email: string): Promise<boolean> {
    return await this.usuarioRepository.exists({
      where: {
        email: email,
      },
      withDeleted: true,
    });
  }
  async existsIncludingDeletedById(id: string): Promise<boolean> {
    return await this.usuarioRepository.exists({
      where: { id: id },
      withDeleted: true,
    });
  }
  async findIncludingDeletedById(id: string): Promise<Usuario> {
    return await this.usuarioRepository.findOne({
      where: { id: id },
      withDeleted: true,
      relations: ['contactos'],
    });
  }
  async findIncludingDeletedByEmail(email: string): Promise<Usuario> {
    return await this.usuarioRepository.findOne({
      where: { email: email },
      withDeleted: true,
    });
  }

  async create(
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<SuccessResponse<{ usuario: ResponseUsuarioDto; access_token }>> {
    Logger.log('Searching if email already exists');
    const usuarioExists = await this.existsIncludingDeletedByEmail(
      createUsuarioDto.email,
    );
    Logger.log('Email exists', usuarioExists);
    if (usuarioExists) {
      throw new BadRequestException('Email already exists');
    }

    Logger.log('Hashing password');
    const hashedPassword = await this.encryptionService.hashPassword(
      createUsuarioDto.password,
    );
    Logger.log('Password hashed successfully');

    const usuario: Usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    const savedUser: Usuario = await this.usuarioRepository.save(usuario);
    Logger.log('User saved successfully');

    const { password, ...usuarioResponse } = savedUser;
    const { access_token } = await this.authService.login(usuarioResponse);
    Logger.log('Returning response');

    return new SuccessResponse(
      'User created successfully',
      {
        usuario: usuarioResponse,
        access_token,
      },
      HttpStatus.CREATED,
    );
  }

  findAll() {
    return this.usuarioRepository.find();
  }

  findAllIncludingDeleted() {
    return this.usuarioRepository.find({ withDeleted: true });
  }

  async findOneByEmail(email: string): Promise<Usuario> {
    const usuario: Usuario = await this.findIncludingDeletedByEmail(email);

    if (!usuario) {
      throw new NotFoundException('Invalid email or password');
    }

    return usuario;
  }

  async findById(id: string): Promise<ResponseUsuarioDto> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const usuario = await this.findIncludingDeletedById(id);

    if (!usuario) {
      throw new NotFoundException('User not found');
    }

    return this.getUserWithoutPass(usuario);
  }
  async findByIdWithPass(id: string): Promise<Usuario> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const usuario = await this.findIncludingDeletedById(id);

    if (!usuario) {
      throw new NotFoundException('User not found');
    }

    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id');
    }
    const usuario = this.usuarioRepository.findOneBy({ id: id });

    if (!usuario) {
      throw new NotFoundException('User not found');
    }
    this.usuarioRepository.update(id, updateUsuarioDto);

    return new SuccessResponse(
      'User updated successfully',
      { id: id },
      HttpStatus.CREATED,
    );
  }

  async remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id');
    }
    const usuario = this.usuarioRepository.findOneBy({ id: id });

    if (!usuario) {
      throw new NotFoundException('User not found');
    }
    try {
      this.usuarioRepository.softDelete(id);
    } catch (error) {
      throw new BadRequestException('Error deleting user');
    }
    return new SuccessResponse(
      'User deleted successfully',
      { id: id },
      HttpStatus.OK,
    );
  }
}
