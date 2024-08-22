import { forwardRef, Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { EncryptionService } from '../../encryption.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Usuario } from './entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]), forwardRef(() => AuthModule)],
  controllers: [UsuarioController],
  providers: [UsuarioService, EncryptionService, JwtAuthGuard, TypeOrmModule],
  exports: [UsuarioService],
})
export class UsuarioModule {}
