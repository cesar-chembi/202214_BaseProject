/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import {ClubEntity} from "./club.entity";


@Injectable()
export class ClubService {
    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>
    ){}

    async findAll(): Promise<ClubEntity[]> {
        return await this.clubRepository.find({ relations: ["socios"] });
    }

    async findOne(codigo: number): Promise<ClubEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {codigo} , relations: ["socios"] } );
        if (!club)
            throw new BusinessLogicException("El Club este identificador no fue encontrado", BusinessError.NOT_FOUND);

        return club;
    }

    async create(club: ClubEntity): Promise<ClubEntity> {

        if (club.descripcion.length < 100)
            return await this.clubRepository.save(club);
        else
            throw new BusinessLogicException("La longitud de la descripcion no es correcta. El club no fue creado", BusinessError.PRECONDITION_FAILED);
    }

    async update(codigo: number, club: ClubEntity): Promise<ClubEntity> {

        const persistedClub = await this.clubRepository.findOne({where:{codigo}});
        if (!persistedClub)
            throw new BusinessLogicException("El Club este identificador no fue encontrado", BusinessError.NOT_FOUND)
        else if (club.descripcion.length < 100){
            persistedClub.nombre = club.nombre;
            persistedClub.fechafundacion = club.fechafundacion;
            persistedClub.imagen = club.imagen;
            persistedClub.descripcion = club.descripcion;
            await this.clubRepository.save(persistedClub);
            return persistedClub;

        }
        else
            throw new BusinessLogicException("La longitud de la descripcion no es correcta. El club no fue creado", BusinessError.PRECONDITION_FAILED);













    }

    async delete(codigo: number) {
        const club: ClubEntity = await this.clubRepository.findOne({where:{codigo}});
        if (!club)
            throw new BusinessLogicException("El Club este identificador no fue encontrado", BusinessError.NOT_FOUND);

        await this.clubRepository.remove(club);
    }
}

