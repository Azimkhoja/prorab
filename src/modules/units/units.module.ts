import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Units } from './entities/unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Units])],
  controllers: [UnitsController],
  providers: [UnitsService],
})
export class UnitsModule {}
