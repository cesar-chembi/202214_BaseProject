/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import {SocioEntity} from "./socio.entity";


@Injectable()
export class SocioService {
    constructor(
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ){}

    async findAll(): Promise<SocioEntity[]> {
        return await this.socioRepository.find({ relations: ["clubes"] });
    }

    async findOne(codigo: number): Promise<SocioEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {codigo} , relations: ["clubes"] } );
        if (!socio)
            throw new BusinessLogicException("El socio con este identificador no fue encontrado", BusinessError.NOT_FOUND);

        return socio;
    }

    async create(socio: SocioEntity): Promise<SocioEntity> {
        if (socio.correoelectronico.includes("@"))
            return await this.socioRepository.save(socio);
        else
            throw new BusinessLogicException("El correo electronico no contiene la @. El socio no fue creado", BusinessError.PRECONDITION_FAILED);

    }

    async update(codigo: number, socio: SocioEntity): Promise<SocioEntity> {

        const persistedSocio = await this.socioRepository.findOne({where:{codigo}});
        if (!persistedSocio)
            throw new BusinessLogicException("El Socio con este identificador no fue encontrado", BusinessError.NOT_FOUND)


        else if (socio.correoelectronico.includes("@")){
            persistedSocio.nombre = socio.nombre;
            persistedSocio.correoelectronico = socio.correoelectronico;
            persistedSocio.fechanacimiento = socio.fechanacimiento;
            await this.socioRepository.save(persistedSocio);
            return persistedSocio;
        }
        else
            throw new BusinessLogicException("El correo electronico no contiene la @. El socio no fue actualizado", BusinessError.PRECONDITION_FAILED);


    }

    async delete(codigo: number) {
        const socio: SocioEntity = await this.socioRepository.findOne({where:{codigo}});
        if (!socio)
            throw new BusinessLogicException("El Socio con este identificador no fue encontrado", BusinessError.NOT_FOUND);

        await this.socioRepository.remove(socio);
    }
}

