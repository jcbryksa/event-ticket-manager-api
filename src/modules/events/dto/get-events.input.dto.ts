import { IsDate, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class GetEventsInputDto {
  @ApiProperty({ required: false, default: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  readonly page?: number = 1

  @ApiProperty({ required: false, default: 50 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  readonly limit?: number = 50

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly presentationTitle: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly performerName: string

  @ApiProperty({ required: false, example: 'teatro' })
  @IsOptional()
  @IsString()
  readonly locationName: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateFrom: Date

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateTo: Date

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  readonly priceFrom?: number

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  readonly priceTo?: number

  @ApiProperty({
    required: false,
    description: '[field1] [asc|desc],[field2] [asc|desc],...',
  })
  @IsOptional()
  @IsString()
  readonly orderBy: string
}
