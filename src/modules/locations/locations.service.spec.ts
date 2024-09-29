import { Test, TestingModule } from '@nestjs/testing'
import { LocationsService } from './locations.service'
import { PrismaModule } from '../../support/prisma/prisma.module'
import { RedisModule } from '../../support/redis/redis.module'

describe('LocationsService', () => {
  let service: LocationsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, RedisModule],
      providers: [LocationsService],
    }).compile()

    service = module.get<LocationsService>(LocationsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
