/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { SocioDTO } from 'src/socio/socio.dto';
import { BusinessErrorsInterceptor } from 'src/interceptors/interceptor';
import { ClubSocioService } from './club-socio.service';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubSocioController {
  constructor(private readonly clubSocioService: ClubSocioService) {}

  @Get(':clubId/members/:memberId')
  async findSocioByClubIdSocioId(@Param('memberId') socioId: number, @Param('clubId') clubId: number) {
    return await this.clubSocioService.findSociosByClubIdSocioId(socioId, clubId);
  }

  @Get(':clubId/members')
  async findSociosByClubId(@Param('clubId') clubId: number) {
    return await this.clubSocioService.findSociosByClubId(clubId);
  }

  @Post(':clubId/members/:memberId/')
  @HttpCode(200)
  async addClubSocio(@Param('memberId') socioId: number, @Param('clubId') clubId: number) {
    return await this.clubSocioService.addClubSocio(clubId, socioId);
  }

  @Put(':clubId/members')
  async associateClubSocio(@Param('clubId') clubId: number, @Body() socioDTO: SocioDTO[]) {
    return await this.clubSocioService.associateClubSocio(clubId, socioDTO);
  }

  @Delete(':clubId/members/:memberId')
  @HttpCode(204)
  async deleteSocioToClub(@Param('memberId') socioId: number, @Param('clubId') clubId: number) {
    return await this.clubSocioService.deleteSocioToClub(socioId, clubId);
  }
}
