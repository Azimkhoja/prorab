import { ApiProperty } from "@nestjs/swagger";

export class CreateUnitDto {
    @ApiProperty({example: "tonna"})
    name: string;

    @ApiProperty({example:"тонна"})
    name_alias?: string;
}
