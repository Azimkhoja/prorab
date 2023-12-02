import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ example: 'Abdulloh', description: 'clients firstname ' })
  name: string;

  @ApiProperty({ example: '+998 90 112 2442', description: 'mijoz tel raqami' })
  phone_number: string;


  @ApiProperty({ example: 'izoh' })
  description: string;
}
