import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payments } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CurrencyType } from 'src/common/enums/currency-type';
import { Counter } from 'src/modules/counter/entities/counter.entity';

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
  constructor(@InjectRepository(Payments) private readonly paymentRepo: Repository<Payments>){}

  async toPay(createPaymentDto: CreatePaymentDto) {

    const queryRunner = this.paymentRepo.manager.connection.createQueryRunner();
    queryRunner.startTransaction()

    try {
      // counter yaratish yani to'lovni hisobga oluvchini
      const counter = new Counter()
      

      let dollar, sum, clientID, counterID;

      if(createPaymentDto.currency_type === CurrencyType.USD){

        sum =  +(createPaymentDto.amount * createPaymentDto.usd_rate).toFixed(2)
        dollar = createPaymentDto.amount

      }else {

        dollar =  +(createPaymentDto.amount / createPaymentDto.usd_rate).toFixed(2)
        sum = createPaymentDto.amount
        
      }

      // responsening counter_id si null bo'lsa bu kirim to'lovi boladi aks holda chiqim
      if(createPaymentDto.counter_id === null){
        clientID = createPaymentDto.client_id
        counterID = null
      }else {
        clientID = null
        counterID = createPaymentDto.counter_id
        
      }

      // to'lovni amalga oshirish
      const payment = new Payments()
      payment.amount = sum
      payment.usd_rate = createPaymentDto.usd_rate
      payment.amount_usd = dollar
      payment.client_id = clientID
      payment.counter_id = counterID
      payment.date = createPaymentDto.date

      const payment_details = await this.paymentRepo.save(payment)



      await queryRunner.commitTransaction()

      return {
        status: 200,
        success: true,
        message: "Transaction committed / payment completed successfully",
        data: payment_details
      }

    } catch (error) {
      await queryRunner.rollbackTransaction()
      return {message: "Transaction failed", error}      
    }
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
