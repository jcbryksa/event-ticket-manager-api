import { Injectable } from '@nestjs/common'
import { RedisService } from '../support/redis/redis.service'
import { CachePrefix } from './cache-prefix.enum'
import { EventStatus } from '../modules/events/event-status.enum'
import { LocationsService } from '../modules/locations/locations.service'
import { PresentationsService } from '../modules/presentations/presentations.service'
import { EventsService } from '../modules/events/events.service'

@Injectable()
export class AppService {
  constructor(
    private redisService: RedisService,
    private locationsService: LocationsService,
    private presentationsService: PresentationsService,
    private eventsService: EventsService,
  ) {}

  async loadCache() {
    // get data from DB
    const [
      locations,
      locationSections,
      presentations,
      presentationSections,
      presentationSectionItems,
      events,
    ] = await Promise.all([
      this.locationsService.findLocations(),
      this.locationsService.findLocationSections(),
      this.presentationsService.findPresentations(),
      this.presentationsService.findPresentationSections(),
      this.presentationsService.findPresentationSectionItems(),
      this.eventsService.findEvents({
        where: { status: { not: EventStatus.pending } },
      }),
    ])

    const eventTicketAvailabilities =
      await this.eventsService.getEventTicketAvailabilities(
        events,
        presentationSections,
        presentationSectionItems,
        locationSections,
      )

    // put data items into redis
    await Promise.all(
      [
        [locations, CachePrefix.location],
        [locationSections, CachePrefix.locationSection],
        [presentations, CachePrefix.presentation],
        [presentationSections, CachePrefix.presentationSection],
        [presentationSectionItems, CachePrefix.presentationSectionItem],
        [events, CachePrefix.event],
        [eventTicketAvailabilities, CachePrefix.eventTicketAvailabilities],
      ].map((entry: [any, CachePrefix]) => [
        Promise.all(
          entry[0].map((data) =>
            this.redisService.set(
              `${entry[1]}-${data.id}`,
              JSON.stringify(data),
            ),
          ),
        ),
      ]),
    )

    // put event list into redis
    await this.redisService.set(
      CachePrefix.eventList,
      JSON.stringify(
        this.eventsService.buildEventList(
          events,
          presentations,
          presentationSections,
          locations,
        ),
      ),
    )

    return { message: 'Data loaded into cache' }
  }
}
