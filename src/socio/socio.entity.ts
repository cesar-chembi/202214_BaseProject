/* eslint-disable prettier/prettier */

import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {ClubEntity} from "../club/club.entity";



@Entity()
export class SocioEntity {

    @PrimaryGeneratedColumn()
    codigo: number;
 
    @Column()
    nombre: string;


    @Column()
    correoelectronico: string;


    @Column()
    fechanacimiento: string;



    @ManyToMany(() => ClubEntity, club => club.socios)
    @JoinTable()
    clubes: ClubEntity[];



}
