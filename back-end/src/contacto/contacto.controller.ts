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
import { ContactoService } from './contacto.service';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('contacto')
@UseGuards(JwtAuthGuard)
export class ContactoController {
  constructor(private readonly contactoService: ContactoService) {}

  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() createContactoDto: CreateContactoDto,
  ) {
    return this.contactoService.create(userId, createContactoDto);
  }

  @Get()
  findAll() {
    return this.contactoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContactoDto: UpdateContactoDto,
  ) {
    return this.contactoService.update(id, updateContactoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactoService.remove(id);
  }
}
