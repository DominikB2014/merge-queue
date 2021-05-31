import * as serverless from 'serverless-http';
import probotApp from './app/app';
import { Probot, Server } from 'probot';
import { environment } from './environments/environment';
import { readFileSync } from 'fs';
import { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda';

export const server = new Server({
  Probot: Probot.defaults({
    appId: process.env.APP_ID,
    privateKey: readFileSync(
      `${__dirname}/assets/test-merge-queue.2021-05-19.private-key.pem`
    ).toString(),
    secret: process.env.WEBHOOK_SECRET,
  }),
});

const startServerLocal = async () => {
  await server.load(probotApp);
  server.start();
};

if (!environment.production) {
  startServerLocal();
}

const serverlessApp = serverless(server.expressApp);

export const handler = async (
  event: APIGatewayProxyEvent | APIGatewayProxyEventV2,
  context
) => {
  await server.load(probotApp);

  const result = await serverlessApp(event, context);
  return result;
};
