import { ApiProperty } from "@nestjs/swagger";

export class CreateCounterDto {
    @ApiProperty({example:2 })
    qty: number

    @ApiProperty({example: 1})
    unit_id: number
    
    @ApiProperty({example: 1})
    item_id: number
}