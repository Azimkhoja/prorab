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

  findAll() {
    return `This action returns all caishers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} caisher`;
  }

  update(id: number, updateCaisherDto: UpdateCaisherDto) {
    return `This action updates a #${id} caisher`;
  }

  remove(id: number) {
    return `This action removes a #${id} caisher`;
  }
}
