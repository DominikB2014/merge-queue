import { Router } from 'express';
import { Probot } from 'probot';
import { ApplicationFunction } from 'probot/lib/types';

const probot: ApplicationFunction = (app: Probot, { getRouter }) => {

  // app.onAny(async (event) => {
  //   console.log('any');
  //   console.log(event.name);
  // });

  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    return context.octokit.issues.createComment(issueComment);
  });


};

export default probot;
