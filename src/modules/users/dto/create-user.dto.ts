import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({example: "Admin" })
    first_name: string;
    
    @ApiProperty({example: "Administrator" })
    last_name: string;

    @ApiProperty({example: "admin" })
    username: string;


    @ApiProperty({example: "+998 95 5568556" })
    phone_number: string;

    @ApiProperty({example: "1234"})

    password: string;
    
    @ApiProperty({example: ""})
    token: string;

    @ApiProperty({example: true})
    is_active: boolean;
}
