import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';

import {WaiterServerApplication} from '../..';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig();

  if (restConfig.port === 0) {
    restConfig.port = parseInt(process.env.PORT ?? '3000');
  }
  if (typeof restConfig.host == 'undefined') {
    restConfig.host = process.env.HOST ?? 'localhost';
  }

  const app = new WaiterServerApplication({
    rest: restConfig,
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: WaiterServerApplication;
  client: Client;
}
