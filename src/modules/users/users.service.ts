import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { response } from 'src/common/response/common-responses';


@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>, ) {}

  async create(createUserDto: CreateUserDto) {
    const foundUser = await this.findByUsername(createUserDto.username)
    console.log(foundUser);
    if(foundUser) {
      return response.AlreadyExists(409, "Bu username ishlatilgan")
    }
    let createdUser = new User()
    
    createdUser.first_name = createUserDto.first_name
    createdUser.last_name = createUserDto.last_name
    createdUser.username = createUserDto.username
    createdUser.password = createUserDto.password
    createdUser.phone_number  = createUserDto.phone_number
    
    const hashedPassword = await argon2.hash(createUserDto.password);

    createdUser = await this.userRepo.save({...createdUser, password: hashedPassword});
    
    return createdUser
  }

  async findAll() {
    return this.userRepo.find()
  }

  async addDefaultUser() {
    const users = await this.userRepo.find()
    if(!users.length){
      const user = await this.userRepo.save({first_name: 'Islomjon', last_name: 'Administrator',username: "islomjon", password:"1234"})
    }
      
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