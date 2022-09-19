/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocioDTO } from 'src/socio/socio.dto';
import { SocioEntity } from 'src/socio/socio.entity';
import { ClubDTO } from 'src/club/club.dto';
import { ClubEntity } from 'src/club/club.entity';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class SocioClubService {
  constructor(
    @InjectRepository(SocioEntity)
    private readonly socioRepository: Repository<SocioEntity>,

    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>
  ) {}

  async addSocioClub(socioId: number, clubId: number): Promise<SocioDTO> {
    const club = await this.clubRepository.findOne({where: {codigo: clubId}});
    if (!club)
      throw new BusinessLogicException("El club con el id dado no se encontro", BusinessError.NOT_FOUND);
    
    const socio = await this.socioRepository.findOne({where: {codigo: socioId}, relations: ["clubes"]});
    if (!socio)
      throw new BusinessLogicException("El socio con el id dado no se encontro", BusinessError.NOT_FOUND);

    socio.clubes = [...socio.clubes, club];
    return await this.socioRepository.save(socio);
  }

  async findClubBySocioIdClubId(clubId: number, socioId: number): Promise<ClubDTO> {
    const club = await this.clubRepository.findOne({where: {codigo: clubId}});
      if (!club)
        throw new BusinessLogicException("El club con el id dado no se encontro", BusinessError.NOT_FOUND)
      
      const socio = await this.socioRepository.findOne({where: {codigo: socioId}, relations: ["clubes"]});
      if (!socio)
        throw new BusinessLogicException("El socio con el id dado no se encontro", BusinessError.NOT_FOUND)

      const socioClub = socio.clubes.find(e => e.codigo === club.codigo);

      if (!socioClub)
        throw new BusinessLogicException("El club con el id dado no esta asociado con el socio", BusinessError.PRECONDITION_FAILED)

      return socioClub;
  }

  async findClubBySocioId(socioId: number): Promise<ClubDTO[]> {
    const socio: SocioEntity = await this.socioRepository.findOne({where: {codigo: socioId}, relations: ["clubes"]});
    if (!socio)
      throw new BusinessLogicException("El socio con el id dado no se encontro", BusinessError.NOT_FOUND)

    return socio.clubes.filter(p => p.constructor.name === "Club")
  }

  async associateSocioClub(socioId: number, clubDTO: ClubDTO[]): Promise<SocioDTO> {
    const socio = await this.socioRepository.findOne({where: {codigo: socioId}, relations: ["clubes"]});

    if (!socio)
      throw new BusinessLogicException("El socio con el id dado no se encontro", BusinessError.NOT_FOUND)

    let clubes: ClubEntity[] = [];

    for (let i = 0; i < clubDTO.length; i++) {
      const club = await this.clubRepository.findOne({where: {codigo: clubes[i].codigo}});
      if (!club)
        throw new BusinessLogicException("El club con el id dado no se encontro", BusinessError.NOT_FOUND)
      else 
        clubes.push(club);
    }

    socio.clubes = clubes;
    return await this.socioRepository.save(socio);
  }

  async deleteClubToSocio(clubId: number, socioId: number): Promise<SocioDTO> {
    const club = await this.clubRepository.findOne({where: {codigo: clubId}});
    if (!club)
      throw new BusinessLogicException("El club con el id dado no se encontro", BusinessError.NOT_FOUND)

    const socio = await this.socioRepository.findOne({where: {codigo: socioId}, relations: ["clubes"]});
    if (!socio)
      throw new BusinessLogicException("El socio con el id dado no se encontro", BusinessError.NOT_FOUND)

    socio.clubes = socio.clubes.filter(e => e.codigo !== clubId);
    return await this.socioRepository.save(socio);
  }
}
