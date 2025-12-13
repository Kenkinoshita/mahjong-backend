import app from '@/index';
import { describe, it, expect } from 'vitest';

describe('GET /', () => {
  it('returns 200 and Hello Hono', async () => {
    const res = await app.fetch(new Request('http://localhost/'));
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('Hello');
  });
});
