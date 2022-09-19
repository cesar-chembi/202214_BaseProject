/* eslint-disable prettier/prettier */

import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {SocioEntity} from "../socio/socio.entity";



@Entity()
export class ClubEntity {

    @PrimaryGeneratedColumn()
    codigo: number;
 
    @Column()
    nombre: string;


    @Column()
    fechafundacion: string;


    @Column()
    imagen: string;


    @Column()
    descripcion: string;



    @ManyToMany(() => SocioEntity, socio => socio.clubes)
    @JoinTable()
    socios: SocioEntity[];


/*
    @OneToMany(() => ProductoEntity, producto => producto.categoria)
    productos: ProductoEntity[];
*/


}
