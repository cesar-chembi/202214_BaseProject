import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocioModule } from './socio/socio.module';
import { ClubModule } from './club/club.module';
import {ClubSocioModule} from "./club-socio/club-socio.module";
import {SocioClubtModule} from "./socio-club/socio-club.module";
import {SocioEntity} from "./socio/socio.entity";
import {ClubEntity} from "./club/club.entity";
import {TypeOrmModule} from "@nestjs/typeorm";


@Module({
  imports: [SocioModule, ClubModule, ClubSocioModule, SocioClubtModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'gastronomia',
      entities: [SocioEntity, ClubEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

