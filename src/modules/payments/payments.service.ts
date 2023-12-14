import { Inject, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payments } from './entities/payment.entity';
import { In, Repository } from 'typeorm';
import { CurrencyType } from 'src/common/enums/currency-type';
import { ItemsService } from '../items/items.service';
import { CounterService } from '../counter/counter.service';
import { response } from 'src/common/response/common-responses';
import { SelectPaymentDto } from './dto/expense-or-revenue.dto';

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

      const item = await this.itemsService.findOne(createPaymentDto.item_id)
      
      if(createPaymentDto.client_id === null){
        
        // counter yaratish yani to'lovni hisobga oluvchini
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
      payments = await this.paymentRepo.find({relations:['clients', 'counters.items.category', 'counters.units']})
    }
    if(payments && payments.length != 0){
       return response.Ok(200,"payments", payments )
     }else {
       return response.NotFound("Payments not found")
   }
  }

  async findExpensesAndRevenues(selectPaydto: SelectPaymentDto) {
    let records
    
      if(selectPaydto.is_expense){

        records = await this.paymentRepo.createQueryBuilder('payments')
        .leftJoinAndSelect('payments.counters', 'counter')
        .leftJoinAndSelect('counter.units', 'unit')
        .leftJoinAndSelect('counter.items', 'item')
        .leftJoinAndSelect('item.category', 'category')
        .where(`client_id IS NULL`)
        .getRawMany()

      }else {

        records = await this.paymentRepo.createQueryBuilder('payments')
        .leftJoinAndSelect('payments.clients', 'client')
        .where(`counter_id IS NULL`)
        .getRawMany()
        
      }
      
      if(records.length != 0) {

      return response.Ok(200, "payments", records)
    }else {
      return response.NotFound("payments not found")
      
    }
  }

  async calculateInAndOutPayments() {
      const allPayments = await this.paymentRepo.find()

      const { incomingPayment, outgoingPayment } = allPayments.reduce(
        (totals, payment) => {
          if (payment.client_id !== null) {
            totals.incomingPayment += +payment.amount;
          }
          if (payment.counter_id !== null) {
            totals.outgoingPayment += +payment.amount;
          }
          return totals;
        },
        { incomingPayment: 0, outgoingPayment: 0 }
      );

      if(allPayments.length != 0) {
        return {income: incomingPayment, outgoing: outgoingPayment, kassa: incomingPayment - outgoingPayment}
      }
      else {
        return response.NotFound("No payments available");
      }
    }

  async  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const oldData = await this.paymentRepo.findOne({where: {id}})
    
    if(oldData.amount != updatePaymentDto.amount){
     
      oldData.amount = updatePaymentDto.amount
      oldData.amount_usd = +(updatePaymentDto.amount / updatePaymentDto.usd_rate).toFixed(2) 
    
    }else if (updatePaymentDto.usd_rate != oldData.usd_rate) {

      oldData.usd_rate = updatePaymentDto.usd_rate
      oldData.amount_usd = +(updatePaymentDto.amount / updatePaymentDto.usd_rate).toFixed(2)
    }
    const updatePayment = await this.paymentRepo.update(id, updatePaymentDto) 
    
    if(updatePayment.affected) {
      return response.Ok(200, "Tahrirlandi")
    }else {
      return response.NotFound("topilmadi");
    }
  }

  
  async  remove(id: number) {
    
    const payment = await this.paymentRepo.update({id: id}, {is_deleted: true})
    
    if(payment.affected){
        return response.Ok(200, "deleted")
      }else {
        return response.NotFound("payment not found");
      }
  }

}
