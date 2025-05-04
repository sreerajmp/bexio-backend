import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import redisClient from '../utils/redisDB';

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    
    // Skip if Redis is not ready
    if (!redisClient.isReady) {
      console.log('Redis not connected, skipping cache');
      return next.handle();
    }

    // Skip if this is a sync request (cache clearing)
    if (req.body.isSync === 'true') {
      const matchingKeys = await redisClient.keys(`${req.body.partyId}_${req.url}_*`);
      if (matchingKeys.length) {
        await Promise.all(matchingKeys.map((key) => redisClient.del(key)));
        console.log('Cache cleared:', matchingKeys);
      }
      return next.handle();
    }

    // Generate cache key (same as in your service)
    const keys = Object.keys(req.body);
    let redisKey = `${req.body.partyId}_${req.url}_`;
    keys.forEach((key) => {
      if (req.body[key] !== undefined) {
        redisKey += `${key}:${req.body[key]}_`;
      }
    });

    // Try to get cached data
    try {
      const cachedData = await redisClient.get(redisKey);
      if (cachedData) {
        console.log('RedisCacheInterceptor: cache hit');
        return new Observable((observer) => {
          const parsedData = JSON.parse(cachedData);
          observer.next(parsedData);  // Emit a value before completing
          observer.complete();
          res.send(parsedData);
        });
      }
    } catch (error) {
      console.error('Error reading from Redis:', error);
    }

    console.log('RedisCacheInterceptor: cache miss');
    
    // Let the request proceed - the service will handle caching
    return next.handle();
  }
}