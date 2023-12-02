import { ApiProperty } from "@nestjs/swagger";


export class CreateCategoryDto {
    @ApiProperty({example: "qurilish mahsulotlari"})
    name: string;

    @ApiProperty({example: "Курилиш махсулотлари"})
    name_alias: string;
}
