import { Contacto } from 'src/contacto/entities/contacto.entity';

export class ResponseUsuarioDto {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  contactos: Contacto[];
}
