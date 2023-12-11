import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-payment.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
    @ApiProperty({example:125000})
    amount?: number
    
    @ApiProperty({example:125000})
    usd_rate?: number
    
    @ApiProperty({example:"2023-12-11"})
    date?: Date;

}
