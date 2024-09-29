import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { LocationsModule } from '../modules/locations/locations.module'
import { PresentationsModule } from '../modules/presentations/presentations.module'
import { EventsModule } from '../modules/events/events.module'
import { TicketsModule } from '../modules/tickets/tickets.module'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from '../support/prisma/prisma.module'
import { RedisModule } from '../support/redis/redis.module'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RedisModule,
    LocationsModule,
    PresentationsModule,
    EventsModule,
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
