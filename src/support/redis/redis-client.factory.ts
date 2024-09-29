import { FactoryProvider } from '@nestjs/common'
import { Redis } from 'ioredis'

export const REDIS_CLIENT = 'RedisClient'

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: REDIS_CLIENT,
  useFactory: () => {
    const redisInstance = new Redis({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    })

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e}`)
    })

    return redisInstance
  },
  inject: [],
}
