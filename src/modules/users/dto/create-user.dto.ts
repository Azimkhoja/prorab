import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({example: "Samandar" })
    first_name: string;
    
    @ApiProperty({example: "Hamroqulov" })
    last_name: string;

    @ApiProperty({example: "samandar" })
    username: string;

    @ApiProperty({example: "112233"})

    password: string;
    
    @ApiProperty({example: ""})
    token: string;

    @ApiProperty({example: true})
    is_active: boolean;
}
