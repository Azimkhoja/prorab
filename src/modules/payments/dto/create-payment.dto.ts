import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';
import { CurrencyType } from 'src/common/enums/currency-type';

export class CreatePaymentDto {
  @ApiProperty({ example: null })
  client_id?: number;

  @ApiProperty({ example: 150000 })
  amount: number;

  @ApiProperty({ example: 12400 })
  usd_rate: number;

  @ApiProperty({ example: '2023-12-06' })
  date: Date;

  @ApiProperty({ example: 1 })
  item_id?: number;

  @ApiProperty({ example: 1 })
  unit_id?: number;

  @ApiProperty({ example: 1 })
  qty?: number;

  @IsNotEmpty()
  @IsIn(['USD', 'UZS'])
  @ApiProperty({ example: 'USD' })
  currency_type: CurrencyType;
}
