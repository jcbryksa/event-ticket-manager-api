import { Test, TestingModule } from '@nestjs/testing'
import { LocationsService } from '../../../modules/locations/locations.service'
import { PrismaModule } from '../../../support/prisma/prisma.module'
import { RedisModule } from '../../../support/redis/redis.module'
import { PrismaService } from '../../../support/prisma/prisma.service'
import { RedisService } from '../../../support/redis/redis.service'
import { locationsMock } from './locations.mock'
import { locationSectionsMock } from './location-sections.mock'

describe('LocationsService', () => {
  let service: LocationsService

  beforeEach(async () => {
    const prismaServiceMock = {
      locations: { findMany: jest.fn(() => locationsMock) },
      locationSections: { findMany: jest.fn(() => locationSectionsMock) },
    }
    const redisServiceMock = {
      getParsed: jest.fn((id: string) => {
        const values = {
          ['location-someLocationId']: locationsMock[0],
          ['locationSection-someLocationSectionId']: locationSectionsMock[0],
        }
        return values[id]
      }),
    }
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, RedisModule],
      providers: [
        LocationsService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
        {
          provide: RedisService,
          useValue: redisServiceMock,
        },
      ],
    }).compile()

    service = module.get<LocationsService>(LocationsService)
  })

  it('should be defined', async () => {
    expect(service).toBeDefined()
  })

  describe('findLocations', () => {
    it('should be return location list', async () => {
      expect(await service.findLocations()).toEqual(locationsMock)
    })
  })

  describe('findLocationSections', () => {
    it('should be return findLocationSections list', async () => {
      expect(await service.findLocationSections()).toEqual(locationSectionsMock)
    })
  })

  describe('getLocationFromCache', () => {
    it('should be return a location', async () => {
      expect(await service.getLocationFromCache('someLocationId')).toEqual(
        locationsMock[0],
      )
    })
  })

  describe('getLocationSectionFromCache', () => {
    it('should be return a locationSection', async () => {
      expect(
        await service.getLocationSectionFromCache('someLocationSectionId'),
      ).toEqual(locationSectionsMock[0])
    })
  })
})
