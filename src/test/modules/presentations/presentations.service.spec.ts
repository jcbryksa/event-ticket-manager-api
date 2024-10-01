import { Test, TestingModule } from '@nestjs/testing'
import { PresentationsService } from '../../../modules/presentations/presentations.service'
import { PrismaModule } from '../../../support/prisma/prisma.module'
import { RedisModule } from '../../../support/redis/redis.module'

describe('PresentationsService', () => {
  let service: PresentationsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, RedisModule],
      providers: [PresentationsService],
    }).compile()

    service = module.get<PresentationsService>(PresentationsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
