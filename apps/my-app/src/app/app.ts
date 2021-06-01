import { Probot } from 'probot';
import { ApplicationFunction } from 'probot/lib/types';
// import { environment } from '../environments/environment';

const probot: ApplicationFunction = (app: Probot) => {
  // app.onAny(async (event) => {
  //   console.log('any');
  //   console.log(event.name);
  // });

  const handleTopOfQueue = () => {
    // Verify the label is there, update branch, set status to in progress
  };

  app.on('pull_request.labeled', async (context) => {
    // Check if label is `merge-to-queue` add to table
    // if at top, update branch with latest trunk, set the status to in progress
    // Else do nothing
    // Comment that pr is in queue
  });

  app.on('pull_request.unlabeled', async (context) => {
    // Delete from dynamo
  });

  app.on('workflow_run.completed', async (context) => {
    // Check if pr is at top, check if branch is up to date, check if label is there, tests pass, reviewed
    // Merge, pop off queue, process next item in queue

    // Comment that pr is at the top queue
    // context.octokit.pulls.merge({
    //   merge_method: 'squash',
    //   commit_message: '',
    // });
  });

  app.on('issues.opened', async (context) => {
    console.log('issue opened!');
    const issueComment = context.issue({
      body: 'Thanks for opening this issue!',
    });

    context.octokit;
    return context.octokit.issues.createComment(issueComment);
  });
};

export default probot;

interface DynamoDBPr {
  id: string;
  status: 'queued' | 'in_progress';
  timestamp: string;
}
