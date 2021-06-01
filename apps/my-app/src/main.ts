// global.atob = require('atob');
// import * as webcrypto from 'webcrypto-core';
// import * as crypto from 'crypto';
// class Crypto {
//   subtle;
  
//   constructor() {
//     this.subtle = new webcrypto.SubtleCrypto();
//   }
  
//   getRandomValues(array) {
//     const buffer = Buffer.from(array.buffer);
//     crypto.randomFillSync(buffer);
//     return array;
//   }
  
// }
// global.crypto = new Crypto();
import * as serverless from 'serverless-http';
import probotApp from './app/app';
import { Probot, Server, createNodeMiddleware, createProbot } from 'probot';
import { environment } from './environments/environment';
import { readFileSync } from 'fs';
import { APIGatewayProxyEvent, APIGatewayProxyEventV2, Context } from 'aws-lambda';
import * as express from 'express';

const app = express();

const probot = new Probot({
  appId: process.env.APP_ID,
  privateKey: readFileSync(
    `${__dirname}/assets/pkcs8.pem`
  ).toString(),
  secret: process.env.WEBHOOK_SECRET
});

app.use((req, res, next) => {
  if (req.body?.toString()) {
    req.body = JSON.parse(req.body.toString());
  }
  next();
})

app.use(createNodeMiddleware(probotApp, {
  probot
}))


app.get('/hello-world', (req, res) => {
  res.send('hello world')
})

if (!environment.production) {
  app.listen(3000, () => {
    console.log('app started on 3000');
  })
}

const serverlessApp = serverless(app);

export const handler = async (
  event: APIGatewayProxyEvent | APIGatewayProxyEventV2,
  context: Context
) => {
  const result = await serverlessApp(event, context);
  return result;
}
