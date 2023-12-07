import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payments } from './entities/payment.entity';
import { ItemsService } from '../items/items.service';
import { CounterService } from '../counter/counter.service';
import { Items } from '../items/entities/item.entity';
import { Counter } from '../counter/entities/counter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payments, Items, Counter])],
  controllers: [PaymentsController],
  providers: [PaymentsService, ItemsService, CounterService],
})
export class PaymentsModule {}
