import { Test, TestingModule } from '@nestjs/testing'
import { TicketsService } from '../../../modules/tickets/tickets.service'
import { PrismaService } from '../../../support/prisma/prisma.service'
import { EventsModule } from '../../../modules/events/events.module'
import { PrismaModule } from '../../../support/prisma/prisma.module'
import { LocationsModule } from '../../../modules/locations/locations.module'
import { RedisModule } from '../../../support/redis/redis.module'

describe('TicketsService', () => {
  let service: TicketsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, RedisModule, EventsModule, LocationsModule],
      providers: [TicketsService, PrismaService],
    }).compile()

    service = module.get<TicketsService>(TicketsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
