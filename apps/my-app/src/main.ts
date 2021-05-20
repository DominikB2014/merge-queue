/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import { Octokit } from '@octokit/rest';
import * as AWS from 'aws-sdk';
import { readFileSync } from 'fs';

const sqs = new AWS.SQS({ apiVersion: '2012-11-05', region: 'us-east-1' });
const pem = readFileSync(
  './test-merge-queue.2021-05-19.private-key.pem',
  'utf-8'
);
const octokit = new Octokit({ auth: process.env.TOKEN });

const app = express();
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
  const isPrReady = await verifyPr();
  if (!isPrReady) {
    completeMessage();
    return;
  }
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
  console.log(pr.data.head.sha);
  // await octokit.rest.checks.create({
  //   owner: 'DominikB2014',
  //   repo: 'merge-queue',
  //   name: 'Next of merge queue',
  //   head_sha: pr.data.head.sha,
  //   status: 'completed',
  //   conclusion: 'success',
  //   output: {
  //     title: 'Merge queue',
  //     summary: '# All good !',
  //   },
  // });

  const isPrReady = await verifyPr();
  if (!isPrReady) {
    completeMessage();
    return;
  }

  await octokit.pulls.merge({
    owner: 'DominikB2014',
    repo: 'merge-queue',
    pull_number: prId,
    merge_method: 'squash',
    // commit_message: `[JIRA-1234] My ticket summary`
  });

  await completeMessage();
};

const verifyPr = async () => {
  const prId = JSON.parse(frontOfQueue.Body).pr;
  const pr = await octokit.rest.pulls.get({
    owner: 'DominikB2014',
    repo: 'merge-queue',
    pull_number: prId,
  });
  console.log(pr.data.head.sha);
  console.log(pr.data.mergeable);
  console.log(pr.data.mergeable_state);
  if (
    !pr.data.mergeable ||
    pr.data.state === 'closed'
  ) {
    return false;
  }

  const prStatus = await octokit.rest.checks.listSuitesForRef({
    owner: 'DominikB2014',
    repo: 'merge-queue',
    ref: pr.data.head.sha,
  });

  for (const checkSuite of prStatus.data.check_suites) {
    if (checkSuite.conclusion !== 'success') {
      return false;
    }
  }
};

const completeMessage = async () => {
  console.log('deleting message');
  await sqs
    .deleteMessage({
      QueueUrl:
        'https://sqs.us-east-1.amazonaws.com/425145600464/merge-queue.fifo',
      ReceiptHandle: frontOfQueue.ReceiptHandle,
    })
    .promise();
  frontOfQueue = undefined;
};

setInterval(async () => {
  if (!frontOfQueue) {
    console.log('Checking for messages');
    const messages = await sqs
      .receiveMessage({
        QueueUrl:
          'https://sqs.us-east-1.amazonaws.com/425145600464/merge-queue.fifo',
        MaxNumberOfMessages: 1,
        VisibilityTimeout: 30,
      })
      .promise();
    console.log(messages.Messages?.map((message) => JSON.parse(message.Body)));
    if (messages.Messages?.length > 0) {
      frontOfQueue = messages.Messages[0];
      processCurrentMessage();
    }
  }
}, 10000);
