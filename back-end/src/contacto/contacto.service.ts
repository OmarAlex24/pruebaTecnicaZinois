import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';
import { Repository } from 'typeorm';
import { Contacto } from './entities/contacto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { UsuarioService } from 'src/usuario/usuario.service';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { SuccessResponse } from 'src/response/success-response.dto';

@Injectable()
export class ContactoService {
  constructor(
    @InjectRepository(Contacto)
    private contactoRepository: Repository<Contacto>,
    private usuarioService: UsuarioService,
  ) {}

  async create(
    usuarioId: string,
    createContactoDto: CreateContactoDto,
  ): Promise<SuccessResponse<{ contacto: Contacto }>> {
    if (!isUUID(usuarioId)) {
      Logger.log('Invalid UUID');
      throw new BadRequestException('Invalid UUID');
    }

    Logger.log('Creating new contacto');
    const nuevoContacto = this.contactoRepository.create(createContactoDto);
    Logger.log('Adding contacto to user');

    const usuario: Usuario =
      await this.usuarioService.findByIdWithPass(usuarioId);

    if (!usuario) {
      throw new NotFoundException('Contact not found');
    }

    nuevoContacto.usuario = usuario;
    Logger.log('Saving contacto');
    await this.contactoRepository.save(nuevoContacto);

    return new SuccessResponse(
      'Contact created successfully',
      { contacto: nuevoContacto },
      HttpStatus.CREATED,
    );
  }

  findAll(): Promise<Contacto[]> {
    return this.contactoRepository.find();
  }

  findAllIncludingDeleted(): Promise<Contacto[]> {
    return this.contactoRepository.find({ withDeleted: true });
  }

  findOne(id: string): SuccessResponse<{ contacto: Promise<Contacto> }> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id');
    }
    const contacto = this.contactoRepository.findOneBy({ id: id });

    if (!contacto) {
      throw new NotFoundException('Contacto not found');
    }

    return new SuccessResponse(
      'Contacto found successfully',
      { contacto: contacto },
      HttpStatus.OK,
    );
  }

  update(
    id: string,
    updateContactoDto: UpdateContactoDto,
  ): SuccessResponse<{ id: string }> {
    if (!this.findOne(id)) {
      throw new NotFoundException('Contacto not found');
    }

    this.contactoRepository.update(id, updateContactoDto);

    return new SuccessResponse(
      'Contact updated successfully',
      { id: id },
      HttpStatus.OK,
    );
  }

  remove(id: string): SuccessResponse<{ id: string }> {
    if (!this.findOne(id)) {
      throw new NotFoundException('Contacto not found');
    }
    Logger.log('Contacto found, deleting');
    try {
      this.contactoRepository.delete(id);
      Logger.log('Contacto deleted');
    } catch (error) {
      throw new Error('Error deleting contacto');
    }

    return new SuccessResponse(
      'Contacto deleted successfully',
      { id: id },
      HttpStatus.OK,
    );
  }
}
