import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key: string) {
    return await this.cache.get<string>(key);
  }

  async set(key: string, value: unknown, ttl: number) {
    return await this.cache.set(key, value, ttl);
  }

  async delete(key: string) {
    return await this.cache.del(key);
  }
}
