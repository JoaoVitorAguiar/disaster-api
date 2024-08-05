import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OccurencesService } from '../services/occurences.service';
import { CreateOccurenceDto, UpdateOccurenceDto } from '../dtos/occurrenceDTO';
import { FileInterceptor } from '@nestjs/platform-express';

import { RoleUser } from '@modules/auth/role.decorator';
import { AuthGuard } from '@modules/auth/providers/auth.guard';
import { Request } from 'express';


interface User {
  id: string;
  email: string;
  roleName: 'admin' | 'client';
}
@Controller('occurences')
export class OccurencesController {
  constructor(private readonly occurencesService: OccurencesService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @RoleUser('client')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Req() req: Request,
    @Body() createOccurenceDto: CreateOccurenceDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const {id} = req.user as User;
    await this.occurencesService.create(id, { ...createOccurenceDto, files });

    return {
      statusCode: 201,
      message: 'Ocorrência criada com sucesso',
    };
  }

  
  @Patch(':id')
  @UseGuards(AuthGuard)
  @RoleUser('admin')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOccurenceDto: UpdateOccurenceDto,
  ) {
    await this.occurencesService.update(id, updateOccurenceDto);

    return {
      statusCode: 200,
      message: 'Ocorrência atualizada com sucesso',
    };
  }

  @Get()
  async findAll() {
    return await this.occurencesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.occurencesService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @RoleUser('admin')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.occurencesService.remove(id);

    return {
      statusCode: 200,
      message: 'Ocorrência deletada com sucesso',
    };
  }
}
