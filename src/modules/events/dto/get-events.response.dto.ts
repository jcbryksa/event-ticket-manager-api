import { ApiProperty } from '@nestjs/swagger'

export class GetEventsResponseDto {
  @ApiProperty()
  readonly eventId: string

  @ApiProperty()
  readonly status: string

  @ApiProperty()
  readonly presentationTitle: string

  @ApiProperty()
  readonly performerName: string

  @ApiProperty()
  readonly locationName: string

  @ApiProperty()
  readonly startDateTime: Date

  @ApiProperty()
  readonly minPrice: number

  @ApiProperty()
  readonly maxPrice: number
}
