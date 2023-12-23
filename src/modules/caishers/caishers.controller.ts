import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CaishersService } from './caishers.service';
import { CreateCaisherDto } from './dto/create-caisher.dto';
import { UpdateCaisherDto } from './dto/update-caisher.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('caishers')
export class CaishersController {
  constructor(private readonly caishersService: CaishersService) {}

  @ApiOperation({summary: "Kassa yaratish"})
  @Post('add')
  create(@Body() createCaisherDto: CreateCaisherDto) {
    return this.caishersService.create(createCaisherDto);
  }

  @Get()
  findAll() {
    return this.caishersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.caishersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCaisherDto: UpdateCaisherDto) {
    return this.caishersService.update(+id, updateCaisherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.caishersService.remove(+id);
  }
}
