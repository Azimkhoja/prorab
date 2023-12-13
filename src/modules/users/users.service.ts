import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    let createdUser = new User()
    
    createdUser.first_name = createUserDto.first_name
    createdUser.last_name = createUserDto.last_name
    createdUser.username = createUserDto.username
    createdUser.password = createUserDto.password
    
    createdUser = await this.userRepo.save(createdUser);
    
    return createdUser
  }

  async findAll() {
    return this.userRepo.find()
  }

  async findById(id: number) {
    return this.userRepo.findOne({where: {id}});
  }

  async findByUsername(username: string) {
    return this.userRepo.findOne({where: {username: username}});
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ) {
    return this.userRepo
      .update(id, updateUserDto);
  }

  async remove(id: number) {
    return this.userRepo.delete(id);
  }
}