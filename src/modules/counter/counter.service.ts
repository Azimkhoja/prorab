import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Counter } from './entities/counter.entity';
import { Repository } from 'typeorm';
import { CreateCounterDto } from './dto/create-counter.dto';
import { response } from 'src/common/response/common-responses';

@Injectable()
export class CounterService {

  constructor(@InjectRepository(Counter) private readonly counterRepo: Repository<Counter>){}

  async createCounter(createCounterDto: CreateCounterDto){
      let counter = new Counter()

      counter.qty = createCounterDto.qty
      counter.unit_id = createCounterDto.unit_id
      counter.item_id = createCounterDto.item_id

      counter = await this.counterRepo.save(counter)

      return response.Ok(201, 'counter created', counter)
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
