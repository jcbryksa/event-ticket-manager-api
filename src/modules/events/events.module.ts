import { Module } from '@nestjs/common'
import { EventsService } from './events.service'
import { EventsController } from './events.controller'
import { PresentationsModule } from '../presentations/presentations.module'
import { LocationsModule } from '../locations/locations.module'

@Module({
  imports: [PresentationsModule, LocationsModule],
  providers: [EventsService],
  exports: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
