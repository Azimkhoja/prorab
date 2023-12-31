import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query, UseGuards,
} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import { CreateClientDto } from './dto/create-client.dto';
import { Clients } from './entities/client.entity';
import { ClientsService } from './clients.service';
import { UpdateClientDto } from './dto/update-client.dto';
import {AuthUser} from "../../common/decorators/auth-user.decorator";

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiOperation({ summary: "Yangi mijoz qo'shish" })
  @ApiResponse({ status: 201, description: "Mijoz qo'shildi!" })
  @Post('/create')
  createClient(@AuthUser() userId:any,@Body() createClientDto: CreateClientDto) {
    return this.clientsService.createClient(createClientDto);
  }

  @ApiOperation({ summary: "Mavjud mijozlar ro'yxati" })
  @ApiResponse({ status: 200, type: Clients })
  @Get('/all')
  getAllClients() {
    return this.clientsService.findAllClients();
  }

  @ApiOperation({ summary: "Mijoz ma'lumotlarini tahrirlash" })
  @ApiResponse({ status: 200, description: "Mijoz ma'lumotlari tahrirlandi." })
  @Patch('/edit/:id')
  updateClient(@Param('id') id: number,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.editClientInfo(id, updateClientDto);
  }

  @ApiOperation({ summary: "Mijoz ma'lumotlari" })
  @ApiResponse({ status: 200, type: Clients })
  @Get('/:id')
  getClientById(@Param('id') id: number) {
    return this.clientsService.findOneClientPayments(id);
  }
  
  @ApiOperation({ summary: "Kassaga tegishli mijozlani olish" })
  @ApiResponse({ status: 200, type: Clients })
  @Get('/by/:caisher_id')
  getClientByCaisherID(@Param('caisher_id') id: number) {
    return this.clientsService.getClientByCaisher(id);
  }

  @ApiOperation({summary: "Mijoz o'chirish"})
  @Delete('remove/:id')
  deleteClient(@Param('id') id: number) {
    return this.clientsService.delete(id)
    }

}
