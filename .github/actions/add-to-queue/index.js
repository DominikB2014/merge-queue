const core = require('@actions/core');
const github = require('@actions/github');
const AWS = require('aws-sdk');
const PRID = process.env.PRID;
const gitHubToken = process.env.TOKEN;

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const octokit = github.getOctokit(gitHubToken);

async function run() {
  try {
    // const affectedApps = execSync('yarn nx affected:apps');
    const affectedApps = ['my-app1', 'my-app2'];

    const isPrReady = await verifyPr();
    if (!isPrReady) {
      throw 'error';
    }
    const prData = await getPrData();
    const status = await sqs
      .sendMessage({
        QueueUrl:
          'https://sqs.us-east-1.amazonaws.com/425145600464/merge-queue.fifo',
        MessageBody: JSON.stringify({
          pr: PRID,
          sha: prData.head.sha,
          affectedApps,
        }),
        MessageGroupId: 'queue',
        MessageDeduplicationId: PRID,
      })
      .promise();
    console.log(status);
  } catch (error) {
    core.setFailed(error.message);
  }
}

const getPrData = async () => {
  const pr = await octokit.rest.pulls.get({
    owner: 'DominikB2014',
    repo: 'merge-queue',
    pull_number: PRID,
  });

  return pr.data;
};

const verifyPr = async () => {
  const pr = await octokit.rest.pulls.get({
    owner: 'DominikB2014',
    repo: 'merge-queue',
    pull_number: PRID,
  });
  console.log(pr.data.head.sha);
  console.log(pr.data.mergeable);
  console.log(pr.data.mergeable_state);
  if (!pr.data.mergeable || pr.data.state === 'closed') {
    return false;
  }

  // const prStatus = await octokit.rest.checks.listSuitesForRef({
  //   owner: 'DominikB2014',
  //   repo: 'merge-queue',
  //   ref: pr.data.head.sha,
  // });
  // console.log(prStatus.data.check_suites);

  // for (const checkSuite of prStatus.data.check_suites) {
  //   if (checkSuite.conclusion !== 'success') {
  //     return false;
  //   }
  // }

  return true;
};

run().catch((e) => {
  throw e;
});
