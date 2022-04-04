import {Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn} from "typeorm";
import { MinLength, IsNotEmpty, IsEmail, isNotEmpty, IsOptional } from "class-validator";
import * as bcrypt from 'bcryptjs';

@Entity()
@Unique(['email'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @MinLength(6)
    @IsNotEmpty()
    username: string;

    @Column()
    @IsNotEmpty()
    apaterno: string;

    @Column()
    @IsNotEmpty()
    amaterno: string;

    @Column()
    @IsNotEmpty()
    nemployee: number;

    @Column()
    @IsNotEmpty()
    departmend: string;

    @Column()
    @MinLength(10)
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Column()
    @MinLength(8)
    @IsNotEmpty()
    password: string;

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @IsOptional()
    resetToken: string;
    
    @Column()
    @IsOptional()
    refreshToken: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    hashPassword():void{
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }


    checkPassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }

}
