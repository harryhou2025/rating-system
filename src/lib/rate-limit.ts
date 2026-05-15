import { NextResponse } from 'next/server';

export function withRateLimit(
  handler: (req: Request) => Promise<NextResponse>,
  options: {
    limit?: number;
    window?: number;
  } = {}
) {
  const limit = options.limit || 100;
  const windowMs = options.window || 60000; // 1分钟

  const requests = new Map<string, number[]>();

  // 定期清理过期记录，防止内存泄漏
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of requests.entries()) {
      const valid = timestamps.filter(time => now - time < windowMs);
      if (valid.length === 0) {
        requests.delete(ip);
      } else {
        requests.set(ip, valid);
      }
    }
  }, Math.min(windowMs, 60000));

  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return async (req: Request) => {
    const ip = req.headers.get('x-forwarded-for') || 
                req.headers.get('x-real-ip') || 
                'unknown';
    
    const now = Date.now();
    const userRequests = requests.get(ip) || [];
    
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= limit) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试' },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(windowMs / 1000)),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': '0',
          }
        }
      );
    }

    validRequests.push(now);
    requests.set(ip, validRequests);

    const response = await handler(req);
    
    response.headers.set('X-RateLimit-Limit', String(limit));
    response.headers.set('X-RateLimit-Remaining', String(limit - validRequests.length));
    
    return response;
  };
}

export function withCORS(handler: (req: Request) => Promise<NextResponse>) {
  return async (req: Request) => {
    const response = await handler(req);
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  };
}
