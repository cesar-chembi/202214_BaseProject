import { ClubSocioService } from './club-socio.service';
import { ClubSocioController } from './club-socio.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from 'src/socio/socio.entity';
import { ClubEntity } from 'src/club/club.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ClubEntity, SocioEntity])],
    controllers: [ClubSocioController],
    providers: [ClubSocioService],
})
export class ClubSocioModule { }
