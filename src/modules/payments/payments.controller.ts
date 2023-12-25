import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
    return this.paymentsService.findExpensesAndRevenues(is_expense);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete('/rem/:id')
  remove(@Param('id') id: number) {
    return this.paymentsService.remove(id);
  }

  @ApiOperation({ summary: "Kassa kirim chiqim malumotlarini olish" })
  @Get('/stats/:caisher_id')
  incomingAndOutgoingPayments(@Param('caisher_id') caisher_id: number) {
    return this.paymentsService.calculateInAndOutPayments(caisher_id);
  }
  

  @ApiOperation({ summary: "Kassa to'lovlarni olish" })
  @Get('by/:caisher_id')
    findPaymentsByCaisher(@Param('caisher_id') caisher_id: number) {
      return this.paymentsService.getPaymentsByCaisher(caisher_id);
    }

  
  @ApiOperation({ summary: "Toifaga aloqador to'lovlarni olish" })
  @Get('category-payement/:id')
  findPaymentsByCategory(@Param('id') id: number) {
    return this.paymentsService.getPaymentsOfCategory(id);
  }


  @ApiOperation({ summary: "Elementga aloqador to'lovlarni olish" })
  @Get('item-payement/:id')
  findPaymentsByItem(@Param('id') id: number) {
    return this.paymentsService.getPaymentsOfItems(id);
  }
}
