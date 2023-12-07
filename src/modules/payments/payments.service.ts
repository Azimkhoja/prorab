import { Inject, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payments } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CurrencyType } from 'src/common/enums/currency-type';
import { Counter } from 'src/modules/counter/entities/counter.entity';
import { ItemsService } from '../items/items.service';
import { CounterService } from '../counter/counter.service';
import { response } from 'src/common/response/common-responses';

//      client_id
//      amount
//      usd_rate
//      amount_usd
//      date
//      counter_id
//      item_id
//      unit_id
//      qty

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payments) private readonly paymentRepo: Repository<Payments>,
    private readonly itemsService: ItemsService,
    private readonly counterService: CounterService

    ){}
    
  async toPay(createPaymentDto: CreatePaymentDto) {
    
    const queryRunner = this.paymentRepo.manager.connection.createQueryRunner();
    queryRunner.startTransaction()
    
    try {
      let dollar, sum, clientID, counterID;
      // counter yaratish yani to'lovni hisobga oluvchini
      const item = await this.itemsService.findOne(createPaymentDto.item_id)

      if(createPaymentDto.client_id === null){
        const counter = await this.counterService.createCounter({qty: createPaymentDto.qty, unit_id: createPaymentDto.unit_id,item_id:item['data'].id})
        clientID = null
        counterID = counter.data['id']
      }else {
        clientID = createPaymentDto.client_id
        counterID = null  
      }
      

      if(createPaymentDto.currency_type === CurrencyType.USD){
        sum =  +(createPaymentDto.amount * createPaymentDto.usd_rate).toFixed(2)
        dollar = createPaymentDto.amount

      }else {

        dollar =  +(createPaymentDto.amount / createPaymentDto.usd_rate).toFixed(2)
        sum = createPaymentDto.amount
        
      }

      // responsening counter_id si null bo'lsa bu kirim to'lovi boladi aks holda chiqim

      // to'lovni amalga oshirish
      const payment = new Payments()
      payment.amount = sum
      payment.usd_rate = createPaymentDto.usd_rate
      payment.amount_usd = dollar
      payment.client_id = clientID
      payment.counter_id = counterID
      payment.date = createPaymentDto.date || new Date() 

      const payment_details = await this.paymentRepo.save(payment)

      await queryRunner.commitTransaction()

      return response.Ok(201, "Transaction committed / payment completed successfully", payment_details)

    } catch (error) {
      await queryRunner.rollbackTransaction()
      return response.Failed(400, "Transaction failed", error)
    }
  }

  async findAll(id: number) {
    let payments
    if(id != 0) {
      payments = await this.paymentRepo.findOne({where: {id: id}})
    }else {
      payments = await this.paymentRepo.find()
    }
    if(payments && payments.length != 0){
       return response.Ok(200,"payments", payments )
     }else {
       return response.NotFound("Payments not found")
   }
  }

  async findExpensesAndRevenues(is_expense: boolean) {
    let records
    if(is_expense["is_expense"]){
      records = await this.paymentRepo.find({where: {client_id: null}, relations: ['counters.items.category' ]})
    }else {
      records = await this.paymentRepo.find({where: {counter_id: null}, relations: ['clients']})
    }

    if(records.length != 0) {

      return response.Ok(200, "payments", records)
    }else {
      return response.NotFound("payments not found")
      
    }
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
