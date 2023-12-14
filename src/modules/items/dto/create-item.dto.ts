import { ApiProperty } from "@nestjs/swagger";

export class CreateItemDto {
@ApiProperty({example: 1})
category_id: number

@ApiProperty({example: "Sement"})
name: string;

@ApiProperty({example: "цемент" })
name_alias: string; 

}
