import { Injectable } from '@nestjs/common'
import { GetEventsInputDto } from './dto/get-events.input.dto'
import { PrismaService } from '../../support/prisma/prisma.service'
import {
  events,
  presentations,
  locationSections,
  presentationSectionItems,
  presentationSections,
  locations,
  Prisma,
} from '@prisma/client'
import { EventStatus } from './event-status.enum'
import { RedisService } from '../../support/redis/redis.service'
import { CachePrefix } from '../../app/cache-prefix.enum'
import * as _ from 'lodash'
import { pagination } from '../../support/helpers/pagination'
import { buildLodashOrderByArgs } from '../../support/helpers/orderby'
import { contains } from '../../support/helpers/strings'
import { GetEventDetailsInputDto } from './dto/get-event-details.input.dto'
import { PresentationsService } from '../presentations/presentations.service'
import { EventListItem } from './event-list-item.type'
import { EventTicketAvailability } from './event-ticket-availability.type'
import { LocationsService } from '../locations/locations.service'
import { GetEventsResponseDto } from './dto/get-events.response.dto'

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private presentationsService: PresentationsService,
    private locationsService: LocationsService,
  ) {}

  async getEvents(input: GetEventsInputDto): Promise<GetEventsResponseDto[]> {
    const events: GetEventsResponseDto[] = await this.redisService.getParsed(
      CachePrefix.eventList,
    )
    return pagination<EventListItem>(
      _(events)
        .filter(
          (event) =>
            (input.presentationTitle
              ? contains(event.presentationTitle, input.presentationTitle)
              : true) &&
            (input.performerName
              ? contains(event.performerName, input.performerName)
              : true) &&
            (input.locationName
              ? contains(event.locationName, input.locationName)
              : true) &&
            (input.dateFrom
              ? new Date(event.startDateTime) >= new Date(input.dateFrom)
              : true) &&
            (input.dateTo
              ? new Date(event.startDateTime) <= new Date(input.dateTo)
              : true) &&
            (input.priceFrom ? event.minPrice >= input.priceFrom : true) &&
            (input.priceTo ? event.minPrice <= input.priceTo : true),
        )
        .orderBy(...(buildLodashOrderByArgs(input.orderBy) || []))
        .value(),
      input.page,
      input.limit,
    )
  }

  async getEventDetails(params: GetEventDetailsInputDto) {
    const [event, eventTicketAvailability] = await Promise.all([
      this.getEventFromCache(params.eventId),
      this.getEventTicketAvailabilityFromCache(params.eventId),
    ])
    const presentation =
      await this.presentationsService.getPresentationFromCache(
        event.presentationId,
      )
    const location = await this.locationsService.getLocationFromCache(
      presentation.locationId,
    )

    const presentationSections = await Promise.all(
      eventTicketAvailability.presentationSections.map(async (ps) => {
        const presentationSection =
          await this.presentationsService.getPresentationSectionFromCache(ps.id)

        return {
          presentationSectionId: presentationSection.id,
          presentationSectionName: presentationSection.name,
          price: presentationSection.price,
          presentationSectionItems: ps.presentationSectionItems,
        }
      }),
    )

    return {
      eventId: params.eventId,
      status: event.status,
      startDateTime: event.startAt,
      presentationTitle: presentation.title,
      presentationDescription: presentation.description,
      performerName: presentation.performerName,
      locationName: location.name,
      presentationSections,
    }
  }

  async findEvents(args?: Prisma.eventsFindManyArgs) {
    return this.prisma.events.findMany(args)
  }

  async getEventTicketAvailabilities(
    events: events[],
    presentationSections: presentationSections[],
    presentationSectionItems: presentationSectionItems[],
    locationSections: locationSections[],
  ): Promise<EventTicketAvailability[]> {
    const eventTicketAvailabilities = await Promise.all(
      events.map(async (event) => {
        // build sections
        const sections: any = presentationSections
          .filter((ps) => ps.presentationId === event.presentationId)
          .map((s) => ({
            id: s.id,
            name: s.name,
            price: s.price,
          }))
        for (const section of sections) {
          // build section items
          section.presentationSectionItems = presentationSectionItems
            .filter((psi) => psi.presentationSectionId === section.id)
            .map((psi) => ({
              presentationSectionItemId: psi.id,
              locationSectionId: psi.locationSectionId,
            }))
          for (const item of section.presentationSectionItems) {
            const locationSection = locationSections.find(
              (ls) => ls.id === item.locationSectionId,
            )

            delete item.locationSectionId

            const ticketItemsSold = await this.countTicketItemSold(
              item.presentationSectionItemId,
            )

            if (ticketItemsSold >= locationSection.capability)
              event.status = EventStatus.sold

            item.locationSectionName = locationSection.name
            item.capability = locationSection.capability
            item.available = locationSection.capability - ticketItemsSold

            let slots
            if (locationSection.indexPrefix) {
              slots = []
              for (
                let index = locationSection.indexFrom;
                index <= locationSection.indexTo;
                index++
              ) {
                slots.push({
                  index,
                  code: `${locationSection.indexPrefix}${index}`,
                  available: (await this.countTicketItemSold(
                    item.presentationSectionItemId,
                    index,
                  ))
                    ? false
                    : true,
                })
              }
            }
            item.slots = slots
          }
        }
        return {
          id: event.id,
          status: event.status,
          presentationId: event.presentationId,
          presentationSections: sections,
        }
      }),
    )
    return eventTicketAvailabilities
  }

  buildEventList(
    events: events[],
    presentations: presentations[],
    presentationSections: presentationSections[],
    locations: locations[],
  ): EventListItem[] {
    return events.map((event) => {
      const presentation = presentations.find(
        (p) => p.id === event.presentationId,
      )
      const location = locations.find((l) => l.id === presentation.locationId)
      const eventPresentationSections = presentationSections.filter(
        (ps) => ps.presentationId === presentation.id,
      )

      const [minPrice, maxPrice] = this.getMinAndMaxPrices(
        eventPresentationSections,
      )

      return {
        eventId: event.id,
        status: event.status,
        presentationTitle: presentation.title,
        performerName: presentation.performerName,
        locationName: location.name,
        startDateTime: event.startAt,
        minPrice,
        maxPrice,
      }
    })
  }

  private getMinAndMaxPrices(
    presentationSections: presentationSections[],
  ): [number, number] {
    let minPrice = presentationSections[0].price
    let maxPrice = minPrice
    for (const section of presentationSections) {
      minPrice = minPrice > section.price ? section.price : minPrice
      maxPrice = maxPrice < section.price ? section.price : maxPrice
    }
    return [minPrice, maxPrice]
  }

  private async getEventFromCache(eventId: string): Promise<events> {
    return this.redisService.getParsed(`${CachePrefix.event}-${eventId}`)
  }

  async getEventTicketAvailabilityFromCache(
    eventId: string,
  ): Promise<EventTicketAvailability> {
    return this.redisService.getParsed(
      `${CachePrefix.eventTicketAvailabilities}-${eventId}`,
    )
  }

  async setEventTicketAvailabilityIntoCache(
    eventId: string,
    eventTicketAvailability: EventTicketAvailability,
  ) {
    return this.redisService.set(
      `${CachePrefix.eventTicketAvailabilities}-${eventId}`,
      JSON.stringify(eventTicketAvailability),
    )
  }

  async countTicketItemSold(
    presentationSectionItemId: string,
    locationSectionIndex?: number,
  ): Promise<number> {
    return this.prisma.ticketItems.count({
      where: {
        presentationSectionItemId,
        locationSectionIndex,
      },
    })
  }
}
