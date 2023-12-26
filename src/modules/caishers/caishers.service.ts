import { Injectable } from '@nestjs/common';
import { CreateCaisherDto } from './dto/create-caisher.dto';
import { UpdateCaisherDto } from './dto/update-caisher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Caisher } from './entities/caisher.entity';
import { Repository } from 'typeorm';
import { response } from 'src/common/response/common-responses';

@Injectable()
export class CaishersService {
  constructor(
    @InjectRepository(Caisher) private caisherRepo: Repository<Caisher>,
  ) {}

  async create(createCaisherDto: CreateCaisherDto) {
    const old_caisher = await this.caisherRepo.findBy({
      name: createCaisherDto.name,
    });

    if (old_caisher.length != 0) {
      return response.AlreadyExists(409, 'bunday kassa  allaqachon mavjud!');
    }

    let new_caisher = new Caisher();
    new_caisher.name = createCaisherDto.name;
    new_caisher.is_active = true;

    new_caisher = await this.caisherRepo.save(new_caisher);

    if(new_caisher) {
      return response.Ok(201, 'Kassa yaratildi');
    }else {
      return response.Failed(400, "Kassa yaratishda xatolik")
    }
  }

  async findAllOrOne(id: number) {
    let caishers;

    if (id != 0) {
      caishers = await this.caisherRepo.findOne({ where: { id } });
    } else {
      caishers = await this.caisherRepo.find({order: {created_at : "DESC"}});
    }
    if (caishers && caishers.length != 0) {
      return response.Ok(200, 'Kassa', caishers);
    } else {
      return response.NotFound('Kassa topilmadi');
    }
  }

  async update(id: number, updateCaisherDto: UpdateCaisherDto) {
    const check = await this.caisherRepo.findOne({
      where: { name: updateCaisherDto.name },
    });
    if (check && check.id !== id) {
      return response.AlreadyExists(409, 'bu nomdagi kassa mavjud');
    }

    const updatedCaisher = await this.caisherRepo.update(
      { id: id },
      updateCaisherDto,
    );

    if (updatedCaisher.affected) {
      return response.Ok(200, 'Kassa tahrirlandi');
    } else {
      return response.NotFound('Kassa  topilmadi');
    }
  }

  async remove(id: number) {
    try {
      const remCaisher = await this.caisherRepo.delete({ id: id });

      if (remCaisher.affected) {
        return response.Ok(200, "kassa o'chirildi");
      } else {
        return response.NotFound("Kassa topilmadi");
      }
    } catch (error) {
      if (error.code === '23503') {
        return response.Failed(400, "Kassani o'chirib bolmaydi", error.message);
      } else {
        console.error('Other error:', error.message);
      }
    }
  }
}
