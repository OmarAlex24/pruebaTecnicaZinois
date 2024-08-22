import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { ContactoModule } from './contacto/contacto.module';
import { UsuarioService } from './usuario/usuario.service';
import { EncryptionService } from 'encryption.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario/entities/usuario.entity';
import { AuthModule } from './auth/auth.module';
import { Contacto } from './contacto/entities/contacto.entity';
import { ContactoService } from './contacto/contacto.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'nestjs_user',
      password: 'nestjs_password',
      database: 'nestjs_db',
      entities: [Usuario, Contacto],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Usuario, Contacto]),
    UsuarioModule,
    ContactoModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsuarioService, EncryptionService, ContactoService],
})
export class AppModule {}
