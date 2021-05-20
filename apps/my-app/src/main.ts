/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import { Octokit } from '@octokit/rest';
import * as AWS from 'aws-sdk';

const sqs = new AWS.SQS({ apiVersion: '2012-11-05', region: 'us-east-1' });

const app = express();
const octokit = new Octokit({ auth: process.env.TOKEN });
let frontOfQueue: AWS.SQS.Message = undefined;

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to my-app!' });
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

const processCurrentMessage = async () => {
  const prId = JSON.parse(frontOfQueue.Body).pr;
  console.log(`processing ${prId}`);
  await octokit.pulls.updateBranch({
    owner: 'DominikB2014',
    pull_number: prId,
    repo: 'merge-queue',
  });

  setTimeout(checksPassHandler, 5000);
};

const checksPassHandler = async () => {
  console.log('running check pass handler');
  const prId = JSON.parse(frontOfQueue.Body).pr;
  const pr = await octokit.rest.pulls.get({
    owner: 'DominikB2014',
    repo: 'merge-queue',
    pull_number: prId,
  });

  await octokit.rest.checks.create({
    owner: 'DominikB2014',
    repo: 'merge-queue',
    name: 'Next of merge queue',
    head_sha: pr.data.head.sha,
    status: 'completed',
    conclusion: 'success',
    output: {
      title: 'Merge queue',
      summary: '# All good !',
    },
  });

  console.log('deleting message');
  sqs.deleteMessage({
    QueueUrl:
      'https://sqs.us-east-1.amazonaws.com/425145600464/merge-queue.fifo',
    ReceiptHandle: frontOfQueue.ReceiptHandle,
  });
  frontOfQueue = undefined;
};

setInterval(async () => {
  if (!frontOfQueue) {
    console.log('Checking for messages');
    const messages = await sqs
      .receiveMessage({
        QueueUrl:
          'https://sqs.us-east-1.amazonaws.com/425145600464/merge-queue.fifo',
        VisibilityTimeout: 30,
        MaxNumberOfMessages: 1,
      })
      .promise();
    console.log(messages.Messages?.map((message) => JSON.parse(message.Body)));
    if (messages.Messages.length > 0) {
      frontOfQueue = messages.Messages[0];
      processCurrentMessage();
    }
  }
}, 10000);
