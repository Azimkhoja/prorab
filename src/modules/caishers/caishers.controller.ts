import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CaishersService } from './caishers.service';
import { CreateCaisherDto } from './dto/create-caisher.dto';
import { UpdateCaisherDto } from './dto/update-caisher.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Caisher")
@Controller('caishers')
export class CaishersController {
  constructor(private readonly caishersService: CaishersService) {}

  @ApiOperation({summary: "Kassa yaratish"})
  @Post('add')
  create(@Body() createCaisherDto: CreateCaisherDto) {
    return this.caishersService.create(createCaisherDto);
  }

  @Get('all/:id')
  async findAll(@Param('id') id: number) {
    return this.caishersService.findAllOrOne(id);
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
