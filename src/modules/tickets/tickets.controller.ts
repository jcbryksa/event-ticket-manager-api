import { Body, Controller, Post } from '@nestjs/common'
import { CreateTicketInputDto } from './dto/create-ticket.input.dto'
import { ApiTags } from '@nestjs/swagger'
import { TicketsService } from './tickets.service'

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  async createTicket(@Body() input: CreateTicketInputDto) {
    return this.ticketsService.createTicket(input)
  }
}
