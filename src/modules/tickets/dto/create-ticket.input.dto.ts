import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

class TicketItem {
  @ApiProperty({
    required: true,
    example: '50ba36f9-733b-11ef-8105-0242ac110002',
  })
  @IsUUID()
  presentationSectionId: string

  @ApiProperty({
    required: true,
    example: '576976eb-7c1a-11ef-a6d5-0242ac110002',
  })
  @IsUUID()
  presentationSectionItemId: string

  @ApiProperty({ required: false, example: 10 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  locationSectionIndex: number
}

export class CreateTicketInputDto {
  @ApiProperty({
    required: true,
    example: 'cc4eab38-7b71-11ef-a6d5-0242ac110002',
  })
  @IsUUID()
  readonly eventId: string

  @ApiProperty({ required: true, example: '22333444' })
  @IsNumber()
  @Min(2000000)
  @Max(99999999)
  @Type(() => Number)
  readonly customerDni: number

  @ApiProperty({ required: true, example: 'Rocky Verbin' })
  @IsString()
  readonly customerName: string

  @ApiProperty({ type: [TicketItem], required: true })
  @IsArray()
  readonly ticketItems: TicketItem[]
}
