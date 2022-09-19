/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocioEntity } from 'src/socio/socio.entity';
import { ClubDTO } from 'src/club/club.dto';
import { SocioDTO } from 'src/socio/socio.dto';
import { ClubEntity } from 'src/club/club.entity';
import { BusinessLogicException, BusinessError } from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';
import {plainToInstance} from "class-transformer";

@Injectable()
export class ClubSocioService {
  constructor(
    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>,

    @InjectRepository(SocioEntity)
    private readonly socioRepository: Repository<SocioEntity>
  ) {}

  async addClubSocio(clubId: number, socioId: number): Promise<ClubDTO> {
    const socio = await this.socioRepository.findOne({where: {codigo: socioId}});
    if (!socio)
      throw new BusinessLogicException("El socio con el id dado no se encontro", BusinessError.NOT_FOUND);
    
    const club = await this.clubRepository.findOne({where: {codigo: clubId}, relations: ["socios"]});
    if (!club)
      throw new BusinessLogicException("El club con el id dado no se encontro", BusinessError.NOT_FOUND);

    club.socios = [...club.socios, socio];
    return await this.clubRepository.save(club);
  }

  async findSociosByClubIdSocioId(socioId: number, clubId: number): Promise<SocioEntity> {
    const socio = await this.socioRepository.findOne({where: {codigo: socioId}});
      if (!socio)
        throw new BusinessLogicException("El socio con el id dado no se encontro", BusinessError.NOT_FOUND)
      
      const club = await this.clubRepository.findOne({where: {codigo: clubId}, relations: ["socios"]});
      if (!club)
        throw new BusinessLogicException("El club con el id dado no se encontro", BusinessError.NOT_FOUND)

      const clubSocio = club.socios.find(e => e.codigo === socio.codigo);

      if (!clubSocio)
        throw new BusinessLogicException("El socio con el id dado no esta asociado con el club", BusinessError.PRECONDITION_FAILED)

      return clubSocio;
  }

  async findSociosByClubId(clubId: number): Promise<SocioEntity[]> {
    const club: ClubEntity = await this.clubRepository.findOne({where: {codigo: clubId}, relations: ["socios"]});
    if (!club)
      throw new BusinessLogicException("El club con el id dado no se encontro", BusinessError.NOT_FOUND)

    return club.socios
  }

  async associateClubSocio(clubId: number, socioDTO: SocioDTO[]): Promise<ClubDTO> {
    const club = await this.clubRepository.findOne({where: {codigo: clubId}, relations: ["socios"]});

    if (!club)
      throw new BusinessLogicException("El club con el id dado no se encontro", BusinessError.NOT_FOUND)

    let socios: SocioEntity[] = [];

    console.log("lo que llega en el DTO",socioDTO)

    for (let i = 0; i < socioDTO.length; i++) {
      const socioActualizado: SocioEntity = plainToInstance(SocioEntity, socioDTO[i]);
      const socio = await this.socioRepository.findOne({where: {codigo: socioDTO[i].codigo}});
      if (!socio)
        throw new BusinessLogicException("El socio con el id dado no se encontro", BusinessError.NOT_FOUND)
      else
       socio.nombre =  socioActualizado.nombre;
       socio.correoelectronico =  socioActualizado.correoelectronico;
       socio.fechanacimiento =  socioActualizado.fechanacimiento;
       socios.push(socio);
    }

    console.log("lo que tiene socios",socios)
    club.socios = socios;
    console.log("lo que tiene club",club)
    await this.clubRepository.merge(club);
    return club;
  }

  async deleteSocioToClub(socioId: number, clubId: number): Promise<ClubDTO> {
    const socio = await this.socioRepository.findOne({where: {codigo: socioId}});
    if (!socio)
      throw new BusinessLogicException("El socio con el id dado no se encontro", BusinessError.NOT_FOUND)

    const club = await this.clubRepository.findOne({where: {codigo: clubId}, relations: ["socios"]});
    if (!club)
      throw new BusinessLogicException("El club con el id dado no se encontro", BusinessError.NOT_FOUND)

    club.socios = club.socios.filter(e => e.codigo !== socioId);
    return await this.clubRepository.save(club);
  }
}
