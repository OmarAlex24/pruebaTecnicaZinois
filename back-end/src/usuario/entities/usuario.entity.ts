import { Contacto } from 'src/contacto/entities/contacto.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToMany,
} from 'typeorm';

import { IsEmail, Min } from 'class-validator';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Index()
  @Column()
  @IsEmail()
  email: string;

  @Column()
  @Min(8)
  password: string;

  @OneToMany(() => Contacto, (contacto) => contacto.usuario, { lazy: true })
  contactos: Contacto[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date | null;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
