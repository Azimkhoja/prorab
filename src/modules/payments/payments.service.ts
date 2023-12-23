import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payments } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CurrencyType } from 'src/common/enums/currency-type';
import { ItemsService } from '../items/items.service';
import { CounterService } from '../counter/counter.service';
import { response } from 'src/common/response/common-responses';
import { SelectPaymentDto } from './dto/expense-or-revenue.dto';
import { Clients } from '../clients/entities/client.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payments)
    private readonly paymentRepo: Repository<Payments>,
    private readonly itemsService: ItemsService,
    private readonly counterService: CounterService,
  ) {}

  async toPay(createPaymentDto: CreatePaymentDto) {
    const queryRunner = this.paymentRepo.manager.connection.createQueryRunner();
    queryRunner.startTransaction();

    try {
      let dollar, sum, clientID, counterID;

      const item = await this.itemsService.findOne(createPaymentDto.item_id);

      if (createPaymentDto.client_id === null) {
        // counter yaratish yani to'lovni hisobga oluvchini
        const counter = await this.counterService.createCounter({
          qty: createPaymentDto.qty,
          unit_id: createPaymentDto.unit_id,
          item_id: item['data'].id,
        });
        clientID = null;
        counterID = counter.data['id'];
      } else {
        clientID = createPaymentDto.client_id;
        counterID = null;
      }

      if (createPaymentDto.currency_type === CurrencyType.USD) {
        sum = +(createPaymentDto.amount * createPaymentDto.usd_rate).toFixed(2);
        dollar = createPaymentDto.amount;
      } else {
        dollar = +(createPaymentDto.amount / createPaymentDto.usd_rate).toFixed(
          2,
        );
        sum = createPaymentDto.amount;
      }

      // responsening counter_id si null bo'lsa bu kirim to'lovi boladi aks holda chiqim

      // to'lovni amalga oshirish

      const payment = new Payments();
      payment.amount = sum;
      payment.usd_rate = createPaymentDto.usd_rate;
      payment.amount_usd = dollar;
      payment.currency_type = createPaymentDto.currency_type;
      payment.client_id = clientID;
      payment.counter_id = counterID;
      payment.date = createPaymentDto.date || new Date();

      const payment_details = await this.paymentRepo.save(payment);

      await queryRunner.commitTransaction();

      return response.Ok(
        201,
        'Transaction committed / payment completed successfully',
        payment_details,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return response.Failed(400, 'Transaction failed', error);
    }
  }

  async findAll(id: number) {
    let payments;
    if (id != 0) {
      payments = await this.paymentRepo.findOne({ where: { id: id } });
    } else {
      payments = await this.paymentRepo.find({
        relations: ['clients', 'counters.items.category', 'counters.units'],
        order: {created_at: 'DESC'}
      });
    }
    if (payments && payments.length != 0) {
      return response.Ok(200, 'payments', payments);
    } else {
      return response.NotFound('Payments not found');
    }
  }

  async findExpensesAndRevenues(selectPaydto: SelectPaymentDto) {
    let records;

    if (selectPaydto.is_expense) {
      records = await this.paymentRepo
        .createQueryBuilder('payments')
        .leftJoinAndSelect('payments.counters', 'counter')
        .leftJoinAndSelect('counter.units', 'unit')
        .leftJoinAndSelect('counter.items', 'item')
        .leftJoinAndSelect('item.category', 'category')
        .where(`client_id IS NULL`)
        .getRawMany();
    } else {
      records = await this.paymentRepo
        .createQueryBuilder('payments')
        .leftJoinAndSelect('payments.clients', 'client')
        .where(`counter_id IS NULL`)
        .getRawMany();
    }

    if (records.length != 0) {
      return response.Ok(200, 'payments', records);
    } else {
      return response.NotFound('payments not found');
    }
  }

  async calculateInAndOutPayments() {
    const allPayments = await this.paymentRepo.find();

    const { incomingPayment, outgoingPayment, incomePaymentUSD, outPaymentUSD } = allPayments.reduce(
      (totals, payment) => {
        if (payment.client_id !== null) {
          totals.incomingPayment += +payment.amount;
          totals.incomePaymentUSD += +payment.amount_usd;
        }
        if (payment.counter_id !== null) {
          totals.outgoingPayment += +payment.amount;
          totals.outPaymentUSD += + payment.amount_usd
        }
        return totals;
      },
      { incomingPayment: 0, outgoingPayment: 0, incomePaymentUSD: 0, outPaymentUSD: 0 },
    );
    
    const clients = await this.paymentRepo.manager.getRepository(Clients).count()

    if (allPayments.length !== 0) {
      return {
        incomingPayment,
        outgoingPayment,
        incomePaymentUSD,
        outPaymentUSD,
        kassaUSD: incomePaymentUSD - outPaymentUSD,
        kassa: incomingPayment - outgoingPayment,
        clients
      };
    } else {
      return response.NotFound('No payments available');
    }
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const oldData = await this.paymentRepo.findOne({ where: { id } });
    let new_amount_usd

    if (
      oldData.amount !== updatePaymentDto.amount ||
      updatePaymentDto.usd_rate !== oldData.usd_rate
    ) {
      new_amount_usd = +(updatePaymentDto.amount / updatePaymentDto.usd_rate).toFixed(2);
    }
    const updatePayment = await this.paymentRepo.update(id, { ...updatePaymentDto, amount_usd: new_amount_usd});

    if (updatePayment.affected) {
      return response.Ok(200, 'Tahrirlandi');
    } else {
      return response.NotFound('topilmadi');
    }
  }

  async remove(id: number) {
    const payment = await this.paymentRepo.delete(
      { id: id }
      // { is_deleted: true },
    );

    if (payment.affected) {
      return response.Ok(200, 'deleted');
    } else {
      return response.NotFound('payment not found');
    }
  }

  async getPaymentsOfCategory(category_id: number) {
      const payments = await this.paymentRepo.createQueryBuilder('payment')
      .innerJoinAndSelect('payment.counters', 'counter')
      .innerJoinAndSelect('counter.items', 'item')
      .where('item.category_id = :category_id', {category_id })
      .getMany();

      if(!payments.length) {
        return response.NotFound("Berilgan toifaga aloqador to'lovlar topilmadi")
      }else {
        return response.Ok(200, "Toifa to'lovlari", payments)

      }
  }

  async getPaymentsOfItems(item_id: number) {

    const itemPayments = await this.paymentRepo.createQueryBuilder('payment')
    .innerJoinAndSelect('payment.counters', 'counter')
    .innerJoinAndSelect('counter.items', 'item')
    .innerJoinAndSelect('counter.units', 'unit')
    .where('item.id = :item_id', {item_id })
    .addSelect('SUM(payment.amount)', 'totalAmount')
    .addSelect('SUM(payment.amount_usd)', 'totalUsdAmount')
    .getMany(); 
  
    if(!itemPayments.length) {

      return response.NotFound("Berilgan elementga aloqador to'lovlar topilmadi")
    
    }else {
    
      return response.Ok(200, "Toifa to'lovlari", itemPayments)

    }

  }
}
