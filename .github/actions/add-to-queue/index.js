const core = require('@actions/core');
const github = require('@actions/github');
const AWS = require('aws-sdk');
const PRID = process.env.PRID;

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

async function run() {
  try {
    const [
      gitHubRepoOwner,
      gitHubRepoName,
    ] = process.env.GITHUB_REPOSITORY.split('/');
    const gitHubSha = process.env.GITHUB_SHA;
    const gitHubToken = process.env.TOKEN;

    console.log(gitHubSha);

    const octokit = github.getOctokit(gitHubToken);

    // const affectedApps = execSync('yarn nx affected:apps');
    const affectedApps = ['my-app1', 'my-app2'];

    const status = await sqs
      .sendMessage({
        QueueUrl:
          'https://sqs.us-east-1.amazonaws.com/425145600464/merge-queue.fifo',
        MessageBody: JSON.stringify({ pr: PRID, affectedApps }),
      })
      .promise();
    console.log(status);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
