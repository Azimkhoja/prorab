import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Counter } from './entities/counter.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CounterService {

  constructor(@InjectRepository(Counter) private readonly counterRepo: Repository<Counter>){

  }
  findAll() {
    return `This action returns all counter`;
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
