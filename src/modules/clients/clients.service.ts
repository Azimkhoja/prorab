import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clients } from './entities/client.entity';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { response } from 'src/common/response/common-responses';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Clients) private readonly clientRepo: Repository<Clients>,
  ) {}

  async createClient(createClientDto: CreateClientDto) {
    try {
      
      const client = await this.clientRepo.findBy({name: createClientDto.name})
      if (client.length != 0) {
        return response.AlreadyExists(409, "Client already exists")
      }

      let newClient = new Clients();
     newClient.name = createClientDto.name;
     newClient.phone_number = createClientDto.phone_number;
     newClient.description = createClientDto.description;

     newClient = await this.clientRepo.save(newClient);

      return response.Ok(201, "Successfully created")
    } catch (error) {
      if (error.code === '23505') {
        return response.AlreadyExists(409, "Client already exists")
      }
    }
  }

  async findAllClients() {
    const clients = await this.clientRepo.find({
      order: { id: 'desc' },
    });
    return response.Ok(200, "clients", clients)
  }

  async findOneClient(id: number) {
    const client = await this.clientRepo.createQueryBuilder('clients')
    .leftJoinAndSelect('clients.payments', 'payment')
    .where('payment.client_id = :id', { id })
    .getRawMany()

    if (client.length != 0) {
      return response.Ok(200, "clients", client)
    }
    return response.NotFound("Clients not found")
  }

  async editClientInfo(id: number, updateClientDto: UpdateClientDto) {
    try {
      const updatedClient = await this.clientRepo.update({id: id}, updateClientDto);
      if (updatedClient.affected) {
        return response.Ok(200, "mijoz tahrirlandi")
      } else {
        return response.NotFound("mijoz topilmadi")
      }
    } catch (error) {
      if (error.code === '23505') {
        return response.Failed(409, "mijoz oldindan mavjud", error.code)
      }
    }
  }

  async delete (id: number ){
    try {
      const client = await this.clientRepo.delete(id)
      if(client.affected) {
        return response.Ok(200, "Deleted")
      }else {
        return response.NotFound("not found") 
      }
    } catch (error) {
      if (error.code === '23503') {
        return response.Failed(400, "Mijoz ochirib bolmaydi ", error.message)
      } else {
        console.error('Other error:', error.message);
      }
    }
    
  }
}
