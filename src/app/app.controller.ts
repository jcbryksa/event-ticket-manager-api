import { Controller, Get, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AppService } from './app.service'

@ApiTags('Application')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getAppRunningMessage(): string {
    return 'API Event Ticket Manager is running'
  }

  @Put('cache')
  loadCache() {
    return this.appService.loadCache()
  }
}
