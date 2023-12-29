import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clients } from './entities/client.entity';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { response } from 'src/common/response/common-responses';
import { Caisher } from '../caishers/entities/caisher.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Clients) private readonly clientRepo: Repository<Clients>,
  ) {}

  async createClient(createClientDto: CreateClientDto) {
    try {
      const client = await this.clientRepo.findBy({
        name: createClientDto.name,
      });
      if (client.length != 0) {
        return response.AlreadyExists(409, 'Client already exists');
      }

      let newClient = new Clients();
      newClient.name = createClientDto.name;
      newClient.phone_number = createClientDto.phone_number;
      newClient.description = createClientDto.description;

      console.log(newClient);
      
      const checkCaisher = await this.clientRepo.manager
      .getRepository(Caisher)
      .findOne({ where: { id: createClientDto.caisher_id } });
      
      console.log(!checkCaisher);
      if (!checkCaisher) {
          return response.Failed(HttpStatus.NOT_FOUND, "kassa mavjud emas")
        }


      newClient.caisher_id = createClientDto.caisher_id;

      newClient = await this.clientRepo.save(newClient);

      return response.Ok(201, 'Successfully created');
    } catch (error) {
      if (error.code === '23505') {
        return response.AlreadyExists(409, 'Client already exists');
      }
    }
  }

  async findAllClients() {
    const clients = await this.clientRepo.find({
      order: { id: 'desc' },
    });
    return response.Ok(200, 'clients', clients);
  }

  async findOneClientPayments(id: number) {
    const client = await this.clientRepo
      .createQueryBuilder('clients')
      .leftJoinAndSelect('clients.payments', 'payment')
      .leftJoinAndSelect('payment.caisher', 'caisher')
      .where('payment.client_id = :id', { id })
      .getOne();

      const sums = client.payments.reduce(
        (accumulator, payment) => {
          accumulator.totalAmount +=  +(payment.amount);
          accumulator.totalUsdAmount +=  +(payment.amount_usd);
          return accumulator;
        },
        { totalAmount: 0, totalUsdAmount: 0}
        );

    if (client.payments.length != 0) {
      client['jami'] = sums
      return response.Ok(200, 'payment of client', client);
    }
    return response.NotFound('Client payments not found');
  }

  async editClientInfo(id: number, updateClientDto: UpdateClientDto) {
    try {
      const updatedClient = await this.clientRepo.update(
        { id: id },
        updateClientDto,
      );
      if (updatedClient.affected) {
        return response.Ok(200, 'mijoz tahrirlandi');
      } else {
        return response.NotFound('mijoz topilmadi');
      }
    } catch (error) {
      if (error.code === '23505') {
        return response.Failed(409, 'mijoz oldindan mavjud', error.code);
      }
    }
  }

  async delete(id: number) {
    try {
      const client = await this.clientRepo.delete(id);
      if (client.affected) {
        return response.Ok(200, 'Deleted');
      } else {
        return response.NotFound('not found');
      }
    } catch (error) {
      if (error.code === '23503') {
        return response.Failed(400, 'Mijozni ochirib bolmaydi ', error.message);
      } else {
        console.error('Other error:', error.message);
      }
    }
  }

  async getClientByCaisher(caisher_id: number){
    const client = await this.clientRepo.find({where: {caisher_id: caisher_id}, order: {created_at: "DESC"}})
    if(!client.length){
      return response.NotFound("Bu kassa boyicha mijoz topilmadi")
    }
    return response.Ok(200, " Kassa mijozlari", client)
  }

}
