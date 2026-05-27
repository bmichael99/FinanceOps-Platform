import { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis";
import { TokenBucket } from "../utils/tokenBucket"

interface RateLimiter {
  capacity: number;
  refillRate: number;
  refillInterval: number;
  prefix: string;
}


export function rateLimiter({capacity = 20, refillRate = 1, refillInterval = 1.0, prefix = 'global'}: RateLimiter){
  // Add tokens at a fixed rate and allow requests to be processed immediately.
  const limiter = new TokenBucket({capacity, refillRate, refillInterval, redisClient: redis});
  return async function tokenBucket(req : Request, res : Response, next : NextFunction) {
    try{
      const {allowed, remaining} = await limiter.allow(`rl:${prefix}:${req.ip}`);

      // Set headers
      res.set("RateLimit-Limit", `${capacity}`);
      res.set("RateLimit-Remaining", String(remaining));

      if(!allowed){
        return res.status(429).json({message: "Request denied. Rate limit exceeded."});
      }
      
      next();
    } catch(err){
      return next(err);
    }
  }
}

