import 'reflect-metadata';

import { serve } from '@hono/node-server';
import app from '@/app';
import { AppDataSource } from '@/data-source';

const port = Number(process.env.PORT || 3000);

// eslint-disable-next-line no-console
console.log(`Listening on port :${port}`);

await AppDataSource.initialize();

const server = serve({
  fetch: app.fetch,
  port,
});

// graceful shutdown
process.on('SIGINT', () => {
  server.close();
  process.exit(0);
});
process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
