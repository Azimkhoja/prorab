import { ApiProperty } from "@nestjs/swagger";

export class SelectPaymentDto {
    @ApiProperty({example: true})
    is_expense: boolean
}