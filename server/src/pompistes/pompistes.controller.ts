import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PompisteService } from './pompistes.service';
import { CreatePompisteDto } from './dto/create-pompiste.dto';
import { UpdatePompisteDto } from './dto/update-pompiste.dto';

@Controller('pompistes')
export class PompistesController {
  constructor(private readonly pompistesService: PompisteService) {}

  @Post()
  create(@Body() createPompisteDto: CreatePompisteDto) {
    return this.pompistesService.create(createPompisteDto);
  }

  @Get()
  findAll() {
    return this.pompistesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pompistesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePompisteDto: UpdatePompisteDto) {
    return this.pompistesService.update(id, updatePompisteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pompistesService.remove(id);
  }
}