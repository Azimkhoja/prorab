import { Module } from '@nestjs/common';
import { CaishersService } from './caishers.service';
import { CaishersController } from './caishers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caisher } from './entities/caisher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Caisher])],
  controllers: [CaishersController],
  providers: [CaishersService],
})
export class CaishersModule {}
