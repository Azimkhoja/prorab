import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clients } from './entities/client.entity';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Clients) private readonly clientRepo: Repository<Clients>,
  ) {}

  async createClient(createClientDto: CreateClientDto) {
    try {
      
      const client = await this.clientRepo.findOne({where: {name: createClientDto.name}})

      if (client) {
        return {
          status: 409,
          success: true,
          message: 'Mijoz allaqachon mavjud!',
        };
      }

      let newClient = new Clients();
     
      return {
        status: 200,
        success: true,
        data: newClient,
        message: "Mijoz ro'yxatga qo'shildi",
      };
    } catch (error) {
      if (error.code === '23505') {
        return {
          message: 'Duplicate key value violates unique constraint',
          status: 409,
        };
      }
    }
  }

  async findAllClients(offset: number, limit: number) {
    const clients = await this.clientRepo.find({
      skip: offset,
      take: limit,
      order: { id: 'desc' },
      relations: ['users'],
    });
    return { status: 200, data: clients, message: "Mijozlar ro'yxati" };
  }

  async findOneClient(id: number) {
    const client = await this.clientRepo.findBy({ id: id });
    if (!client) {
      return { status: 400, message: 'client not fount' };
    }
    return { status: 200, data: client, message: 'success' };
  }

  async editClientInfo(id: number, updateClientDto: UpdateClientDto) {
    try {
      const updatedClient = await this.clientRepo.update({id: id}, updateClientDto);
      if (updatedClient.affected) {
        return {
          success: true,
          message: "Mijoz ma'lumotalri tahrirlandi",
        };
      } else {
        return {
          success: false,
          message: 'Mijoz tahrirlanmadi',
        };
      }
    } catch (error) {
      if (error.code === '23505') {
        return {
          status: 409,
          message: 'Duplicate key value violates unique constraint',
          errorcode: error.code,
        };
      }
    }
  }
}
