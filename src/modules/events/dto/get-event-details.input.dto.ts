import { IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetEventDetailsInputDto {
  @ApiProperty({
    required: true,
    example: 'cc4eab38-7b71-11ef-a6d5-0242ac110002',
  })
  @IsUUID()
  readonly eventId: string
}
