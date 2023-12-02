import { Injectable } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Units } from './entities/unit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UnitsService {

  constructor (@InjectRepository(Units) private readonly unitsRepo: Repository<Units>){}
  
  async create(createUnitsDto: CreateUnitDto) {
    const old_units = await this.unitsRepo.findBy({name: createUnitsDto.name})
    
    if(old_units.length != 0 ){
      return {
        status: 409,
        success: true,
        message: "O'lchov birligi allaqachon mavjud!",}
    }

    let new_units = new Units()
    new_units.name = createUnitsDto.name
    new_units.name_alias = createUnitsDto.name_alias

    new_units = await this.unitsRepo.save(new_units)
  
    return {
      status: 201,
      success: true,
      message: "O'lchov birligi qo'shildi"
    }

  }

  async findUnits(id: number) {
    let units
    if(id != 0){
      units = await this.unitsRepo.findOne({where: {id: id}})
    }else {
      units = await this.unitsRepo.find()
    }
    if(!units || units.length == 0){
      return {
        status: 404,
        success: false,
        message: "Units not found"
      }
    }
    return {
      status: 200,
      success: true,
      data: units
    }
  }

  async updateUnits(id: number, updateUnitsDto: UpdateUnitDto) {
    const check = await this.unitsRepo.findBy({name: updateUnitsDto.name})
    if(check.length){
      return {status: 409, message: "Units already exists"}

    }
    const updateUnits = await this.unitsRepo.update({id: id}, updateUnitsDto)
    if(updateUnits.affected){
      return {status: 200, message: "Units updated successfully"}
    }else {
      return {status: 404, message: "Units not found"}
      
    }
}
async  remove(id: number) {
  const remUnits = await this.unitsRepo.delete({id: id})

  if(remUnits.affected){
    return {
      status: 200,
      success: true,
      message: "Units deleted successfully"
    }
  }
    else {
    return {
      status: 404,
      success: false,
      message: "Units not found"
    }
      
    }

}
}
