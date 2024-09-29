import { Injectable } from '@nestjs/common'
import { locations, locationSections, Prisma } from '@prisma/client'
import { CachePrefix } from '../../app/cache-prefix.enum'
import { PrismaService } from '../../support/prisma/prisma.service'
import { RedisService } from '../../support/redis/redis.service'

@Injectable()
export class LocationsService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  async findLocations(args?: Prisma.locationsFindManyArgs) {
    return this.prisma.locations.findMany(args)
  }

  async findLocationSections(args?: Prisma.locationSectionsFindManyArgs) {
    return this.prisma.locationSections.findMany(args)
  }

  async getLocationSectionFromCache(
    locationSectionId: string,
  ): Promise<locationSections> {
    return this.redisService.getParsed(
      `${CachePrefix.locationSection}-${locationSectionId}`,
    )
  }

  async getLocationFromCache(locationId: string): Promise<locations> {
    return this.redisService.getParsed(`${CachePrefix.location}-${locationId}`)
  }
}
