import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { response } from 'src/common/response/common-responses';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private readonly categoryRepo: Repository<Category>){}
  
  
  async create(createCategoryDto: CreateCategoryDto) {
    const old_category = await this.categoryRepo.findBy({name: createCategoryDto.name})
    
    if(old_category.length != 0 ){
      return response.AlreadyExists(409, "Kategoriya allaqachon mavjud!") 
    }

    let new_category = new Category()
    new_category.name = createCategoryDto.name
    new_category.name_alias = createCategoryDto.name_alias

    new_category = await this.categoryRepo.save(new_category)
  
    return response.Ok(201, "yaratildi", )

  }

  async findCategory(id: number) {
    let category
    if(id != 0){
      category = await this.categoryRepo.findOne({where: {id: id}})
    }else {
      category = await this.categoryRepo.find()
    }
    if(!category && category.length == 0){
      return response.NotFound("No category found")
    }
    return response.Ok(200, "OK", category)
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    const check = await this.categoryRepo.findBy({name: updateCategoryDto.name})
    if(check.length){
      return response.AlreadyExists(409, "Category already exists")

    }
    const updateCategory = await this.categoryRepo.update({id: id}, updateCategoryDto)
    if(updateCategory.affected){
      return response.Ok(200, "Category updated")
    }else {
      return response.NotFound("Category not found")      
    }
  }

  async  remove(id: number) {
    const remCategory = await this.categoryRepo.delete({id: id})
  
    if(remCategory.affected){
      return response.Ok(200, "Category deleted")
    }
      else {
      return response.NotFound("Category not found")
        
      }

  }
}
