import {
  // MiddlewareConsumer,
  Module,
  // NestModule,
  // RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
// import { LoggerMiddleware } from './common/middleware/logger-middleware';
import { UnitsModule } from './modules/units/units.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ItemsModule } from './modules/items/items.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/(.*)'],
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/images'),
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    ClientsModule,
    UnitsModule,
    ItemsModule,
    PaymentsModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule /* implements NestModule */ {
  // constructor() {}
  // configure(consumer: MiddlewareConsumer) {}
}
