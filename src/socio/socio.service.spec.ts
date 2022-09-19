/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';
import { faker } from '@faker-js/faker';
import {ClubEntity} from "../club/club.entity";


describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let sociosList: SocioEntity[];



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
    providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    sociosList = [];
    for(let i = 0; i < 5; i++){
        const socio: SocioEntity = await repository.save({
        nombre: faker.company.name(),
        correoelectronico: faker.company.name(),
        fechanacimiento: faker.company.name(),


        })
      sociosList.push(socio);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debería devolver todas las socios', async () => {
    const socios: SocioEntity[] = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(sociosList.length);
  });

  it('findOne debería devolver un socio por el codigo', async () => {
    const storedSocio: SocioEntity = sociosList[0];
    const socio: SocioEntity = await service.findOne(storedSocio.codigo);
    expect(socio).not.toBeNull();
    expect(socio.nombre).toEqual(storedSocio.nombre)

    });

  it('findOnedebería lanzar una excepcion para un socio invalido ', async () => {
     await expect(() => service.findOne(0)).rejects.toHaveProperty("message", "El Socio con este identificador no fue encontrado")
  });

  it('create deberia retornar un nuevo socio', async () => {
    const socio: SocioEntity = {
      codigo: 0,
      nombre: faker.company.name(),
      correoelectronico: faker.company.name(),
      fechanacimiento: faker.company.name(),
      clubes: ClubEntity[0]

    }

    const newSocio: SocioEntity = await service.create(socio);
    expect(newSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({where: {codigo: newSocio.codigo}})
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toEqual(newSocio.nombre)
  });

  it('update deberia modificar un nuevo socio', async () => {
    const socio: SocioEntity = sociosList[0];
    socio.nombre = "New nombre";

  
    const updatedSocio: SocioEntity = await service.update(socio.codigo, socio);
    expect(updatedSocio).not.toBeNull();
  
    const storedSocio: SocioEntity = await repository.findOne({ where: { codigo: socio.codigo } })
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toEqual(socio.nombre)

  });
 
  it('update debería lanzar una excepcion para un socio invalido', async () => {
    let socio: SocioEntity = sociosList[0];
    socio = {
      ...socio, nombre: "New nombre"
    }
    await expect(() => service.update(0, socio)).rejects.toHaveProperty("message", "El Socio con este identificador no fue encontrado")
  });

  it('delete  deberia remover un socio', async () => {
    const socio: SocioEntity = sociosList[0];
    await service.delete(socio.codigo);
  
    const deletedSocio: SocioEntity = await repository.findOne({ where: { codigo: socio.codigo } })
    expect(deletedSocio).toBeNull();
  });

  it('delete debería lanzar una excepcion para un socio invalido', async () => {
    const socio: SocioEntity = sociosList[0];
    await service.delete(socio.codigo);
    await expect(() => service.delete(0)).rejects.toHaveProperty("message", "El Socio con este identificador no fue encontrado")
  });
 
});
