import { Test, TestingModule } from '@nestjs/testing'
import { EventsService } from '../../../modules/events/events.service'
import { PrismaModule } from '../../../support/prisma/prisma.module'
import { RedisModule } from '../../../support/redis/redis.module'
import { PresentationsModule } from '../../../modules/presentations/presentations.module'
import { LocationsModule } from '../../../modules/locations/locations.module'
import { TicketsModule } from '../../../modules/tickets/tickets.module'

describe('EventsService', () => {
  let service: EventsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        RedisModule,
        PresentationsModule,
        LocationsModule,
        TicketsModule,
      ],
      providers: [EventsService],
    }).compile()

    service = module.get<EventsService>(EventsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
