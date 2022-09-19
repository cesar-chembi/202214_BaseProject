/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';
import { faker } from '@faker-js/faker';
import {SocioEntity} from "../socio/socio.entity";

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubList: ClubEntity[];



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
    providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    clubList = [];
    for(let i = 0; i < 5; i++){
        const club: ClubEntity = await repository.save({
        nombre: faker.company.name(),
          fechafundacion: faker.company.name(),
          imagen: faker.company.name(),
          descripcion: faker.company.name(),
        })
      clubList.push(club);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debería devolver todas los clubes', async () => {
    const clubes: ClubEntity[] = await service.findAll();
    expect(clubes).not.toBeNull();
    expect(clubes).toHaveLength(clubList.length);
  });

  it('findOne debería devolver un club por el codigo', async () => {
    const storedClub: ClubEntity = clubList[0];
    const club: ClubEntity = await service.findOne(storedClub.codigo);
    expect(club).not.toBeNull();
    expect(club.nombre).toEqual(storedClub.nombre)

    });

  it('findOne debería lanzar una excepcion para un Club invalido ', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty("message", "El Club con este identificador no fue encontrado")
  });

  it('create deberia retornar un nuevo Club', async () => {
    const club: ClubEntity = {
      codigo: 0,
      nombre: faker.company.name(),
      fechafundacion: faker.name.findName(),
      imagen: faker.name.findName(),
      descripcion: faker.name.findName(),
      socios: SocioEntity[0]

    }

    const newClub: ClubEntity = await service.create(club);
    expect(newClub).not.toBeNull();

    const storedClub: ClubEntity = await repository.findOne({where: {codigo: newClub.codigo}})
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(newClub.nombre)
  });

  it('update deberia modificar un nuevo club', async () => {
    const club: ClubEntity = clubList[0];
    club.nombre = "New nombre";

  
    const updatedClub: ClubEntity = await service.update(club.codigo, club);
    expect(updatedClub).not.toBeNull();
  
    const storedClub: ClubEntity = await repository.findOne({ where: { codigo: club.codigo } })
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(club.nombre)

  });
 
  it('update debería lanzar una excepcion para un club invalido', async () => {
    let club: ClubEntity = clubList[0];
    club = {
      ...club, nombre: "New nombre"
    }
    await expect(() => service.update(0, club)).rejects.toHaveProperty("message", "El Club con este identificador no fue encontrado")
  });

  it('delete  deberia remover un club', async () => {
    const club: ClubEntity = clubList[0];
    await service.delete(club.codigo);
  
    const deletedClub: ClubEntity = await repository.findOne({ where: { codigo: club.codigo } })
    expect(deletedClub).toBeNull();
  });

  it('delete debería lanzar una excepcion para un club invalido', async () => {
    const club: ClubEntity = clubList[0];
    await service.delete(club.codigo);
    await expect(() => service.delete(0)).rejects.toHaveProperty("message", "El Club con este identificador no fue encontrado")
  });
 
});
