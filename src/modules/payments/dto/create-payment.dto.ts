import { ApiProperty } from "@nestjs/swagger";

export class CreatePaymentDto {
    @ApiProperty({example: 1})
    client_id: number


    @ApiProperty({example: 150000})
    amount: number

    @ApiProperty({example: 12400})
    usd_rate: number

    @ApiProperty({example: 11})
    amount_usd: number

    @ApiProperty({example:"12-11-2023"})
    date: Date

    @ApiProperty({example: 1})
    item_id: number;
}
