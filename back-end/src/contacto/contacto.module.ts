import { Module } from '@nestjs/common';
import { ContactoService } from './contacto.service';
import { ContactoController } from './contacto.controller';
import { Contacto } from './entities/contacto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contacto]), UsuarioModule],
  controllers: [ContactoController],
  providers: [ContactoService],
  exports: [ContactoService],
})
export class ContactoModule {}
