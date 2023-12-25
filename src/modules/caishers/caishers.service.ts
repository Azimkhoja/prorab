import { Injectable } from '@nestjs/common';
import { CreateCaisherDto } from './dto/create-caisher.dto';
import { UpdateCaisherDto } from './dto/update-caisher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Caisher } from './entities/caisher.entity';
import { Repository } from 'typeorm';
import { response } from 'src/common/response/common-responses';

@Injectable()
export class CaishersService {
  constructor(@InjectRepository(Caisher) private caisherRepo: Repository<Caisher>) {}

  async create(createCaisherDto: CreateCaisherDto) {
    const old_caisher = await this.caisherRepo.findBy({name: createCaisherDto.name})
    
    if(old_caisher.length != 0 ){
      return response.AlreadyExists(409, "Kassa  allaqachon mavjud!") 
    }

    let new_caisher = new Caisher()
    new_caisher.name = createCaisherDto.name

    new_caisher = await this.caisherRepo.save(new_caisher)
  
    return response.Ok(201, "Kassa yaratildi", )

  }

  async findAllOrOne(id: number) {
    let caishers
    if(id != 0 ) {
      caishers = await this.caisherRepo.findOne({where: {id}})
    }else {
      caishers = await this.caisherRepo.find()
    }
    if(caishers && caishers.length != 0){
      return response.Ok(200,"Kassa", caishers )
     }else {
       return response.NotFound("Kassa topilmadi")
   }

  }

 
  async update(id: number, updateCaisherDto: UpdateCaisherDto) {
    const updatedCaisher = await this.caisherRepo.update({id: id}, updateCaisherDto)
    if(updatedCaisher.affected) {
      return response.Ok(200, "Kassa tahrirlandi")
    }else {
      return response.NotFound("Kassa  topilmadi")
    } }


  remove(id: number) {
    return `This action removes a #${id} caisher`;
  }
}
