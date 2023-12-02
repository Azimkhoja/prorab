import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private readonly categoryRepo: Repository<Category>){}
  
  
  async create(createCategoryDto: CreateCategoryDto) {
    const old_category = await this.categoryRepo.findBy({name: createCategoryDto.name})
    
    if(old_category.length != 0 ){
      return {
        status: 409,
        success: true,
        message: 'Kategoriya allaqachon mavjud!',}
    }

    let new_category = new Category()
    new_category.name = createCategoryDto.name
    new_category.name_alias = createCategoryDto.name_alias

    new_category = await this.categoryRepo.save(new_category)
  
    return {
      status: 201,
      success: true,
      message: "Kategoriya qo'shildi"
    }

  }

  async findCategory(id: number) {
    let category
    if(id != 0){
      category = await this.categoryRepo.findOne({where: {id: id}})
    }else {
      category = await this.categoryRepo.find()
    }
    if(!category || category.length == 0){
      return {
        status: 404,
        success: false,
        message: "Category not found"
      }
    }
    return {
      status: 200,
      success: true,
      data: category
    }
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    const check = await this.categoryRepo.findBy({name: updateCategoryDto.name})
    if(check.length){
      return {status: 409, message: "Category already exists"}

    }
    const updateCategory = await this.categoryRepo.update({id: id}, updateCategoryDto)
    if(updateCategory.affected){
      return {status: 200, message: "Category updated successfully"}
    }else {
      return {status: 404, message: "Category not found"}
      
    }
  }

  async  remove(id: number) {
    const remCategory = await this.categoryRepo.delete({id: id})
  
    if(remCategory.affected){
      return {
        status: 200,
        success: true,
        message: "Category deleted successfully"
      }
    }
      else {
      return {
        status: 404,
        success: false,
        message: "Category not found"
      }
        
      }

  }
}
