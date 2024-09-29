import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../../support/prisma/prisma.service'
import { CreateTicketInputDto } from './dto/create-ticket.input.dto'
import { EventsService } from '../events/events.service'
import { SlotAvailability } from '../events/event-ticket-availability.type'
import { ticketItems } from '@prisma/client'

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
  ) {}

  async createTicket(input: CreateTicketInputDto) {
    const ticketData = await this.getTicketData(input)
    // update availability data in cache
    await this.eventsService.setEventTicketAvailabilityIntoCache(
      input.eventId,
      ticketData.eventTicketAvailability,
    )
    // creation in db
    let ticketId: string
    await this.prisma.$transaction(async (prisma) => {
      const ticket = await prisma.tickets.create({
        data: {
          eventId: input.eventId,
          customerDni: input.customerDni,
          customerName: input.customerName,
          paymentAmount: ticketData.paymentAmount,
        },
      })
      ticketId = ticket.id
      await prisma.ticketItems.createMany({
        data: ticketData.ticketItems.map((ti, index) => ({
          ticketId,
          presentationSectionItemId: ti.presentationSectionItemId,
          locationSectionIndex: ti.locationSectionIndex,
          paymentAmount: ti.paymentAmount,
          sort: index + 1,
        })),
      })
    })
    return { message: `Ticket [${ticketId}] created` }
  }

  private async getTicketData(input: CreateTicketInputDto) {
    const eventTicketAvailability =
      await this.eventsService.getEventTicketAvailabilityFromCache(
        input.eventId,
      )
    if (!eventTicketAvailability)
      throw new NotFoundException(`eventId [${input.eventId}] not found`)

    const ticketItems: Partial<ticketItems>[] = []
    let paymentAmount: number = 0
    for (const ticketItem of input.ticketItems) {
      const presentationSection =
        eventTicketAvailability.presentationSections.find(
          (ps) => ps.id === ticketItem.presentationSectionId,
        )
      if (!presentationSection)
        throw new NotFoundException(
          `presentationSectionId [${ticketItem.presentationSectionId}] not found`,
        )

      const presentationSectionItem =
        presentationSection.presentationSectionItems.find(
          (psi) =>
            psi.presentationSectionItemId ===
            ticketItem.presentationSectionItemId,
        )

      if (!presentationSectionItem)
        throw new NotFoundException(
          `presentationSectionItemId [${ticketItem.presentationSectionItemId}] not found`,
        )

      if (presentationSectionItem.available <= 0)
        throw new ConflictException(
          `presentationSectionItemId [${ticketItem.presentationSectionItemId}] not available`,
        )

      presentationSectionItem.available--

      let slot: SlotAvailability
      if (presentationSectionItem.slots?.length) {
        if (ticketItem.locationSectionIndex === undefined)
          throw new BadRequestException(
            `ticketItems with presentationSectionItemId [${ticketItem.presentationSectionItemId}] must contain a locationSectionIndex value`,
          )
        slot = presentationSectionItem.slots.find(
          (s) => s.index === ticketItem.locationSectionIndex,
        )
        if (!slot)
          throw new NotFoundException(
            `slot index [${ticketItem.locationSectionIndex}] in presentationSectionItemId [${ticketItem.presentationSectionItemId}] not found`,
          )
        if (!slot.available)
          throw new ConflictException(
            `slot index [${ticketItem.locationSectionIndex}] in presentationSectionItemId [${ticketItem.presentationSectionItemId}] not available`,
          )
        slot.available = false
      }

      ticketItems.push({
        presentationSectionItemId: ticketItem.presentationSectionItemId,
        paymentAmount: presentationSection.price,
        locationSectionIndex: ticketItem.locationSectionIndex,
      })

      paymentAmount += presentationSection.price
    }
    return {
      paymentAmount,
      ticketItems,
      eventTicketAvailability,
    }
  }
}
