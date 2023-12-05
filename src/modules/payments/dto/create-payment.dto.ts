import { ApiProperty } from "@nestjs/swagger";
import { CurrencyType } from "src/common/enums/currency-type";

export class CreatePaymentDto {
    @ApiProperty({example: 1})
    client_id?: number

    @ApiProperty({example: 150000})
    amount: number

    @ApiProperty({example: 12400})
    usd_rate: number

    @ApiProperty({example:"12-11-2023"})
    date: Date
    
    @ApiProperty({example: 1})
    counter_id?: number;
     
    @ApiProperty({example: 1})
    item_id?: number;
    
    @ApiProperty({example: 1})
    unit_id?: number;

    @ApiProperty({example: 1})
    qty?: number;
    
    @ApiProperty({example: 'uds'})
    currency_type: CurrencyType

}
