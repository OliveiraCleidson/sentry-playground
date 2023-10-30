import { readFileSync } from 'fs';
import { resolve } from 'path';

import { applicationFactory } from './factories';

const packageJSON: { version: string } = JSON.parse(
  readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'),
);

async function bootstrap() {
  const [app, logger] = await applicationFactory(packageJSON.version);

  const port = process.env.PORT || 3000;
  logger.log(
    `Application is running on: ${port}, environment: ${process.env.NODE_ENV}`,
  );
  await app.listen(port);
}

bootstrap();
