import { Global, Module } from '@nestjs/common'
import { RedisService } from './redis.service'
import { redisClientFactory } from './redis-client.factory'

@Global()
@Module({
  providers: [redisClientFactory, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
