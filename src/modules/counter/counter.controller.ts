import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CounterService } from './counter.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Counter')
@Controller('counter')
export class CounterController {
  constructor(private readonly counterService: CounterService) {}

  @Get()
  findAll() {
    return this.counterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.counterService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.counterService.remove(+id);
  }
}
