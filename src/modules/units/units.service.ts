import { Injectable } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Units } from './entities/unit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { response } from 'src/common/response/common-responses';

@Injectable()
export class UnitsService {

  constructor (@InjectRepository(Units) private readonly unitsRepo: Repository<Units>){}
  
  async create(createUnitsDto: CreateUnitDto) {
    const old_units = await this.unitsRepo.findBy({name: createUnitsDto.name})
    
    if(old_units.length != 0 ){
      return response.AlreadyExists(409, "O'lchov birligi allaqachon mavjud!")
    }

    let new_units = new Units()
    new_units.name = createUnitsDto.name
    new_units.name_alias = createUnitsDto.name_alias

    new_units = await this.unitsRepo.save(new_units)
  
    return response.Ok(201, "O'lchov birligi qo'shildi")

  }

  async findUnits(id: number) {
    let units
    if(id != 0){
      units = await this.unitsRepo.findOne({where: {id: id}})
    }else {
      units = await this.unitsRepo.find()
    }
    if(!units && units.length == 0){
      return response.NotFound("Units not found")
    }
    return response.Ok(200, "units", units)
  }

  async updateUnits(id: number, updateUnitsDto: UpdateUnitDto) {
    const check = await this.unitsRepo.findBy({name: updateUnitsDto.name})
    if(check.length){
      return response.AlreadyExists(409, "Units already exists")

    }
    const updateUnits = await this.unitsRepo.update({id: id}, updateUnitsDto)
    if(updateUnits.affected){
      return response.Ok(200, "Units updated successfully")
    }else {
      return response.NotFound("Units not found")
      
    }
}
async  remove(id: number) {
  const remUnits = await this.unitsRepo.delete({id: id})

  if(remUnits.affected){
    return response.Ok(200, "Units removed successfully")
  }
    else {
    return response.NotFound("Units not found")
      
    }

}
}
