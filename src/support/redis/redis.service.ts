import { Inject, Injectable } from '@nestjs/common'
import Redis from 'ioredis'
import { REDIS_CLIENT } from './redis-client.factory'

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  async get(key: string) {
    return this.redisClient.get(key)
  }

  async getParsed(key: string) {
    return JSON.parse(await this.redisClient.get(key))
  }

  async set(key: string, value: string) {
    return this.redisClient.set(key, value)
  }

  async delete(key: string) {
    return this.redisClient.del(key)
  }
}
