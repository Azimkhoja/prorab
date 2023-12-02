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
      
      const client = await this.clientRepo.findBy({name: createClientDto.name})
      if (client.length != 0) {
        return {
          status: 409,
          success: true,
          message: 'Mijoz allaqachon mavjud!',
        };
      }

      let newClient = new Clients();
     newClient.name = createClientDto.name;
     newClient.phone_number = createClientDto.phone_number;
     newClient.description = createClientDto.description;

     newClient = await this.clientRepo.save(newClient);

      return {
        status: 200,
        success: true,
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
    });
    return { status: 200, data: clients, message: "Mijozlar ro'yxati" };
  }

  async findOneClient(id: number) {
    const client = await this.clientRepo.findBy({ id: id });
    if (!client) {
      return { status: 400, message: 'Client not found' };
    }
    return { status: 200, data: client, message: 'success' };
  }

  async editClientInfo(id: number, updateClientDto: UpdateClientDto) {
    try {
      const updatedClient = await this.clientRepo.update({id: id}, updateClientDto);
      if (updatedClient.affected) {
        return {
          success: true,
          message: "Mijoz ma'lumotlari tahrirlandi",
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
