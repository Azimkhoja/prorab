import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Units')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @ApiOperation({summary: "Units qo'shish"})
  @Post('/add')
  createUnits(@Body() createUnitsDto: CreateUnitDto) {
    return this.unitsService.create(createUnitsDto);
  }

  @ApiOperation({summary: "Units lar ro'yxatini olish"})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unitsService.findUnits(+id);
  }

  @ApiOperation({summary: "Units tahrirlash"})
  @Patch('/edit/:id')
  update(@Param('id') id: string, @Body() updateUnitsDto: UpdateUnitDto) {
    return this.unitsService.updateUnits(+id, updateUnitsDto);
  }
  
  
  @ApiOperation({summary: "Units O'chirish"})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitsService.remove(+id);
  }

}
