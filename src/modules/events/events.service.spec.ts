import { Test, TestingModule } from '@nestjs/testing'
import { EventsService } from './events.service'
import { PrismaModule } from '../../support/prisma/prisma.module'
import { RedisModule } from '../../support/redis/redis.module'
import { PresentationsModule } from '../presentations/presentations.module'
import { LocationsModule } from '../locations/locations.module'
import { TicketsModule } from '../tickets/tickets.module'

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
