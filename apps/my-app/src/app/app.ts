import { Router } from 'express';
import { Probot } from 'probot';
import { ApplicationFunction } from 'probot/lib/types';

const probot: ApplicationFunction = (app: Probot, { getRouter }) => {
  const router: Router = getRouter();

  router.get('/hello-world', (req, res) => {
    res.send('Hello World');
  });

  app.log('Yay! The app was loaded!');

  // app.onAny(async (event) => {
  //   console.log('any');
  //   console.log(event.name);
  // });

  app.on('check_run.completed', () => {
    console.log('ON ISSUES');
  });

  app.on('label.created', async (context) => {
    console.log('test');
    return context.octokit.issues.createComment(
      context.issue({ body: 'Hello, World!' })
    );
  });
};

export default probot;
