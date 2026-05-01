import {redis} from "./redis";

const DEFAULT_TTL = 60 * 10;

export async function getCache<T>(key: string): Promise<T | null> {
  const data = await redis.get(key);

  if (!data) return null;

  return data as T;
}

export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = DEFAULT_TTL,
) {
  await redis.set(key, value, {
    ex: ttl,
  });
}

export async function deleteCache(key: string) {
  await redis.del(key);
}

export async function deleteManyCache(keys: string[]) {
  if (!keys.length) return;

  await redis.del(...keys);
}

export async function deleteByPattern(pattern: string) {
  let cursor = 0;

  do {
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: pattern,
      count: 100,
    });

    cursor = Number(nextCursor);

    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } while (cursor !== 0);
}

export async function getOrSetCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = DEFAULT_TTL,
): Promise<T> {
  const cached = await getCache<T>(key);

  if (cached) return cached;

  const freshData = await fn();

  await setCache(key, freshData, ttl);

  return freshData;
}
