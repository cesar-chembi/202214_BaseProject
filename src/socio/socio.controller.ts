import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/interceptors/interceptor';
import { plainToInstance } from 'class-transformer';
import { SocioDTO } from './socio.dto';
import {SocioService} from './socio.service';
import {SocioEntity} from "./socio.entity";

@Controller('members')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioController {
    constructor(private readonly socioService: SocioService) {}

    @Get()
    async findAll() {
        return await this.socioService.findAll();
    }

    @Get(':memberId')
    async findOne(@Param('memberId') socioId: number) {
        return await this.socioService.findOne(socioId);
    }

    @Post()
    @HttpCode(201)
    async create(@Body() socioDTO: SocioDTO) {
        const socio: SocioEntity = plainToInstance(SocioEntity, socioDTO);
        return await this.socioService.create(socio);
    }



    @Put(':memberId')
    async update(@Param('memberId') socioId: number, @Body() socioDTO: SocioDTO) {
        const socio: SocioEntity = plainToInstance(SocioEntity, socioDTO);
        return await this.socioService.update(socioId, socio);
    }


    @Delete(':memberId')
    @HttpCode(204)
    async delete(@Param('memberId') socioId: number) {
        return await this.socioService.delete(socioId);
    }






}
