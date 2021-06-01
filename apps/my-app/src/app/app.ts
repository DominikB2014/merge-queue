import { App } from '@octokit/app';
import { readFileSync } from 'fs';
import { Probot } from 'probot';
import { ApplicationFunction } from 'probot/lib/types';
// import { environment } from '../environments/environment';

const probot: ApplicationFunction = (app: Probot) => {

  // app.onAny(async (event) => {
  //   console.log('any');
  //   console.log(event.name);
  // });

  app.onAny((event) => {
    console.log(event.name);
  })

  app.on("issues.opened", async (context) => {
    console.log('issue opened!')
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });

    context.octokit
    return context.octokit.issues.createComment(issueComment);
  });


};

export default probot;
