import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiTags } from '@nestjs/swagger';
import { SelectPaymentDto } from './dto/expense-or-revenue.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.toPay(createPaymentDto);
  }

  @Get('/all-one/:id')
  findAll(@Param('id') id: number) {
    return this.paymentsService.findAll(id);
  }

  @Post('/select')
  expenseOrRevenue(@Body() is_expense: SelectPaymentDto) {
    return this.paymentsService.findExpensesAndRevenues(is_expense)
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete('/rem/:id')
  remove(@Param('id') id: number) {
    return this.paymentsService.remove(id); 
  }

  @Get('/stats')
  incomingAndOutgoingPayments() {
    return this.paymentsService.calculateInAndOutPayments()
  }
}
