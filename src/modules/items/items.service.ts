import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Items } from './entities/item.entity';
import { Repository } from 'typeorm';
import { response } from 'src/common/response/common-responses';

@Injectable()
export class ItemsService {

  constructor(@InjectRepository(Items) private readonly itemsRepo: Repository<Items>){

  }

  async createItem(createItemDto: CreateItemDto) {
    const newItem = await this.itemsRepo.findOne({where: {name: createItemDto.name}})
    
    if(newItem){
      return response.AlreadyExists(409, "xarajat turi allaqachon mavjud!")
    }

    let item = new Items()
    item.name = createItemDto.name;
    item.category_id = createItemDto.category_id;
    item.name_alias = createItemDto.name_alias;
    
    item = await this.itemsRepo.save(item)
  
    return response.Ok(201, "Xarajat turi yaratildi",item )
  }

  async findOne(id: number) {
    let items
    if(id != 0) {
      items = await this.itemsRepo.findOne({where: {id: id}})
    }else {
      items = await this.itemsRepo.find()
    }

    if(items && items.length != 0){
     return response.Ok(200,"itmes", items )
    }else {
      return response.NotFound("Items not found")
  }
  }

  async findSubCategory(category_id: number ){
    const items = await this.itemsRepo.find({where: {category_id: category_id}})
    if(items.length != 0){
      return response.Ok(200, 'items those related with this category', items)
    }else{
      return response.NotFound("items not found")
    }
  }
  
  async update(id: number, updateItemDto: UpdateItemDto) {
      const updatedItem = await this.itemsRepo.update({id: id}, updateItemDto)
      if(updatedItem.affected) {
        return response.Ok(200, "Tahrirlandi")
      }else {
        return response.NotFound("Xarajat nomi topilmadi")
      }
  }


  // database ni tozalaydigan funksiya
  async clearDatabase() {
    const connection = this.itemsRepo.manager.connection;
    const queryRunner = connection.createQueryRunner();

    const table_names = connection.entityMetadatas.map(
      (entity) => entity.tableName,
    );
    const check = [];

    for await (const table_name of table_names) {
      // ============================== 2 usul ============================
      const res = await queryRunner.query(
        `TRUNCATE TABLE "${table_name}" RESTART IDENTITY CASCADE`,
      );
      check.push(res);
    }
    
    return table_names.length == check.length
  }
}
