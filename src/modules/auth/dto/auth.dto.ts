import { ApiProperty } from "@nestjs/swagger";

export class AuthDto {
  @ApiProperty({example: "samandar"})
  username: string;
  
  @ApiProperty({example: "112233"})
    password: string;
  }
  