import { SocioClubController } from './socio-club.controller';
import { SocioClubService } from './socio-club.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from 'src/socio/socio.entity';
import { ClubEntity } from 'src/club/club.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SocioEntity, ClubEntity])],
    controllers: [SocioClubController],
    providers: [SocioClubService],
})
export class SocioClubtModule { }
