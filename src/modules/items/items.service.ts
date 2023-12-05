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
      response.AlreadyExists(409, "xarajat turi allaqachon mavjud!")
    }

    let item = new Items()
    item.name = createItemDto.name;
    item.category_id = createItemDto.category_id;
    item.name_alias = createItemDto.name_alias;
    
    item = await this.itemsRepo.save(item)
  
    response.Ok(201, "Xarajat turi yaratildi",item )
  }

  async findOne(id: number) {
    let items
    if(id != 0) {
      items = await this.itemsRepo.findOne({where: {id: id}})
    }else {
      items = await this.itemsRepo.find()
    }

    if(items && items.length != 0){
      response.Ok(200, items )
    }else {
      response.NotFound("Items not found")
  }
  }
  async update(id: number, updateItemDto: UpdateItemDto) {
      const updatedItem = await this.itemsRepo.update({id: id}, updateItemDto)
      if(updatedItem.affected) {
        response.Ok(200, "Tahrirlandi")
      }else {
        response.NotFound("Xarajat topilmadi")
      }
  }

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
