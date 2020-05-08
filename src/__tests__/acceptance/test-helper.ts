import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';

import {WaiterServerApplication} from '../..';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    host: '::1',
    port: 0,
  });

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
