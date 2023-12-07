import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post('/add')
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.createItem(createItemDto);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @Get('/related/:id')
  findRelatedItems(@Param('id') id: number) {
    return this.itemsService.findSubCategory(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(id, updateItemDto);
  }

  @ApiOperation({
    summary: `EHTIYOT BO'LAMIZ ⛔⛔⛔ BU REQUEST BAZANI TOZALAB YUBORADI `,
  })
  @Delete('/clear-database')
  
  truncateDatabase() {
    return this.itemsService.clearDatabase().then((data) => {
      if (data) {
        return { success: true, message: 'Database tozalandi ✅' };
      } else {
        return { success: false, message: 'Database tozalashda xatolik ❌' };
      }
    });
  }
}
