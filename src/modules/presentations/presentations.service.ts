import { Injectable } from '@nestjs/common'
import { presentations, presentationSections, Prisma } from '@prisma/client'
import { CachePrefix } from '../../app/cache-prefix.enum'
import { PrismaService } from '../../support/prisma/prisma.service'
import { RedisService } from '../../support/redis/redis.service'

@Injectable()
export class PresentationsService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  async findPresentations(args?: Prisma.presentationsFindManyArgs) {
    return this.prisma.presentations.findMany(args)
  }

  async findPresentationSections(
    args?: Prisma.presentationSectionsFindManyArgs,
  ) {
    return this.prisma.presentationSections.findMany(args)
  }

  async findPresentationSectionItems(
    args?: Prisma.presentationSectionItemsFindManyArgs,
  ) {
    return this.prisma.presentationSectionItems.findMany(args)
  }

  async getPresentationFromCache(
    presentationId: string,
  ): Promise<presentations> {
    return this.redisService.getParsed(
      `${CachePrefix.presentation}-${presentationId}`,
    )
  }

  async getPresentationSectionFromCache(
    presentationSectionId: string,
  ): Promise<presentationSections> {
    return this.redisService.getParsed(
      `${CachePrefix.presentationSection}-${presentationSectionId}`,
    )
  }
}
