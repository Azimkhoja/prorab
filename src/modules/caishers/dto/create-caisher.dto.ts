import { ApiProperty } from "@nestjs/swagger";

export class CreateCaisherDto {

    @ApiProperty({example: "Oxygen"})
    name: string

    @ApiProperty({example: true})
    is_active: boolean

}

