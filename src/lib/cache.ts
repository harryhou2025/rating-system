import { unstable_cacheLife as cacheLife } from 'next/cache';

export const CACHE_REVALIDATION = {
  SHORT: 60, // 1分钟
  MEDIUM: 300, // 5分钟
  LONG: 3600, // 1小时
  VERY_LONG: 86400, // 24小时
};

export const CACHE_TAGS = {
  SCALES: 'scales',
  QUESTIONS: 'questions',
  STATISTICS: 'statistics',
  USER_ASSESSMENTS: 'user-assessments',
};

export function getCacheKey(prefix: string, ...args: (string | number)[]): string {
  return `${prefix}:${args.join(':')}`;
}

export function setCacheHeaders(response: Response, maxAge: number = CACHE_REVALIDATION.MEDIUM): Response {
  response.headers.set('Cache-Control', `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`);
  return response;
}
