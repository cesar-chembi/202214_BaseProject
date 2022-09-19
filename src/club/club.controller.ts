import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/interceptors/interceptor';
import { plainToInstance } from 'class-transformer';
import { ClubDTO } from './club.dto';
import {ClubService} from './club.service';
import {ClubEntity} from "./club.entity";

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubController {
    constructor(private readonly clubService: ClubService) {}

    @Get()
    async findAll() {
        return await this.clubService.findAll();
    }

    @Get(':clubId')
    async findOne(@Param('clubId') clubId: number) {
        return await this.clubService.findOne(clubId);
    }

    @Post()
    @HttpCode(201)
    async create(@Body() clubDTO: ClubDTO) {
        const club: ClubEntity = plainToInstance(ClubEntity, clubDTO);
        return await this.clubService.create(club);
    }



    @Put(':clubId')
    async update(@Param('clubId') clubId: number, @Body() clubDTO: ClubDTO) {
        const club: ClubEntity = plainToInstance(ClubEntity, clubDTO);
        return await this.clubService.update(clubId, club);
    }


    @Delete(':clubId')
    @HttpCode(204)
    async delete(@Param('clubId') clubId: number) {
        return await this.clubService.delete(clubId);
    }






}
