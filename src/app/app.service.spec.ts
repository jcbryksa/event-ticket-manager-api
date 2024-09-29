import { Test, TestingModule } from '@nestjs/testing'
import { AppService } from './app.service'
import { PrismaModule } from '../support/prisma/prisma.module'
import { RedisModule } from '../support/redis/redis.module'
import { EventsModule } from '../modules/events/events.module'
import { PresentationsModule } from '../modules/presentations/presentations.module'
import { LocationsModule } from '../modules/locations/locations.module'

describe('AppService', () => {
  let service: AppService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        RedisModule,
        EventsModule,
        PresentationsModule,
        LocationsModule,
      ],
      providers: [AppService],
    }).compile()

    service = module.get<AppService>(AppService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
