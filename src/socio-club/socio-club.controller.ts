/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/interceptors/interceptor';
import { ClubDTO } from 'src/club/club.dto';
import { SocioClubService } from './socio-club.service';

@Controller('members')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioClubController {
  constructor(private readonly socioClubService: SocioClubService) {}

  @Get(':memberId/clubs/:clubId')
  async findClubBySocioIdClubId(@Param('clubId') clubId: number, @Param('memberId') socioId: number) {
    return await this.socioClubService.findClubBySocioIdClubId(clubId, socioId);
  }

  @Get(':memberId/clubs')
  async findClubesBySocioId(@Param('memberId') socioId: number) {
    return await this.socioClubService.findClubBySocioId(socioId);
  }

  @Post(':memberId/clubs/:clubId/')
  @HttpCode(200)
  async addSocioClub(@Param('clubId') clubId: number, @Param('memberId') socioId: number) {
    return await this.socioClubService.addSocioClub(socioId, clubId);
  }

  @Put(':memberId/clubs')
  async associateSocioClub(@Param('socioId') socioId: number, @Body() clubDTO: ClubDTO[]) {
    return await this.socioClubService.associateSocioClub(socioId, clubDTO);
  }

  @Delete(':memberId/clubs/:clubId')
  @HttpCode(204)
  async deleteClubToSocio(@Param('clubId') clubId: number, @Param('memberId') socioId: number) {
    return await this.socioClubService.deleteClubToSocio(clubId, socioId);
  }
}
