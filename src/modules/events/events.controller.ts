import { Controller, Get, Param, Query } from '@nestjs/common'
import { EventsService } from './events.service'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetEventsInputDto } from './dto/get-events.input.dto'
import { GetEventDetailsInputDto } from './dto/get-event-details.input.dto'
import { GetEventsResponseDto } from './dto/get-events.response.dto'

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Event list',
    type: [GetEventsResponseDto],
  })
  async getEvents(@Query() input: GetEventsInputDto) {
    return this.eventsService.getEvents(input)
  }

  @Get(':eventId')
  async getEventDetails(@Param() params: GetEventDetailsInputDto) {
    return this.eventsService.getEventDetails(params)
  }
}
