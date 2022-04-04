import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { isNotEmpty, IsNotEmpty, IsOptional } from 'class-validator';

@Entity()
//@Unique(['id_solic'])
export class Pass {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    id_solict: number;

    @Column()
    @IsNotEmpty()
    hotel: string;

    @Column()
    @IsNotEmpty()
    name_razon: string;

    @Column()
    @IsNotEmpty()
    temporalidad: string;

    @Column()
    @IsOptional()
    fecha_retorno: Date;

    @Column()
    @IsNotEmpty()
    direccion_solici: string;

    @Column()
    @IsNotEmpty()
    articulos_name: string;

    @Column()
    @IsNotEmpty()
    descripcion: string;

    @Column()
    @IsNotEmpty()
    cant_arti: number;

    @Column()
    @IsNotEmpty()
    procedencia_area: string;

    @Column()
    @IsNotEmpty()
    motivo_salida: string;

    @Column()
    @IsNotEmpty()
    status: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}