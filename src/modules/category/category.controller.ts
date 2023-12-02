import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({summary: "Category qo'shish"})
  @Post('/add')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({summary: "Category lar ro'yxatini olish"})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findCategory(+id);
  }

  @ApiOperation({summary: "Category tahrirlash"})
  @Patch('/edit/:id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(+id, updateCategoryDto);
  }
  
  
  @ApiOperation({summary: "Category O'chirish"})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
