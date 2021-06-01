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

// const event = {
//   headers: {
//     'Request method': 'POST',
//     Accept: '*/*',
//     ['X-GitHub-Delivery']: '40e32bd0-c23f-11eb-93ff-9554de78c407',
//     ['X-GitHub-Event']: 'issues',
//     ['X-GitHub-Hook-ID']: '299576161',
//     ['X-GitHub-Hook-Installation-Target-ID']: '116160',
//     ['X-GitHub-Hook-Installation-Target-Type']: 'integration',
//     ['X-Hub-Signature']: 'sha1=fab54b7b1df2aed4ca86f7677da588219dab04ef',
//     ['X-Hub-Signature-256']: 'sha256=0f79a8ee3dbee011a5d174114e51929d46169aec358e9a31221406e54b607e20',
//   },
//   httpMethod: 'POST',
//   body: "{\"action\":\"opened\",\"issue\":{\"url\":\"https://api.github.com/repos/DominikB2014/merge-queue/issues/11\",\"repository_url\":\"https://api.github.com/repos/DominikB2014/merge-queue\",\"labels_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/issues/11/labels{/name}\",\"comments_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/issues/11/comments\",\"events_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/issues/11/events\",\"html_url\":\"https://github.com/DominikB2014/merge-queue/issues/11\",\"id\":907740154,\"node_id\":\"MDU6SXNzdWU5MDc3NDAxNTQ=\",\"number\":11,\"title\":\"test comment\",\"user\":{\"login\":\"DominikB2014\",\"id\":44422760,\"node_id\":\"MDQ6VXNlcjQ0NDIyNzYw\",\"avatar_url\":\"https://avatars.githubusercontent.com/u/44422760?v=4\",\"gravatar_id\":\"\",\"url\":\"https://api.github.com/users/DominikB2014\",\"html_url\":\"https://github.com/DominikB2014\",\"followers_url\":\"https://api.github.com/users/DominikB2014/followers\",\"following_url\":\"https://api.github.com/users/DominikB2014/following{/other_user}\",\"gists_url\":\"https://api.github.com/users/DominikB2014/gists{/gist_id}\",\"starred_url\":\"https://api.github.com/users/DominikB2014/starred{/owner}{/repo}\",\"subscriptions_url\":\"https://api.github.com/users/DominikB2014/subscriptions\",\"organizations_url\":\"https://api.github.com/users/DominikB2014/orgs\",\"repos_url\":\"https://api.github.com/users/DominikB2014/repos\",\"events_url\":\"https://api.github.com/users/DominikB2014/events{/privacy}\",\"received_events_url\":\"https://api.github.com/users/DominikB2014/received_events\",\"type\":\"User\",\"site_admin\":false},\"labels\":[],\"state\":\"open\",\"locked\":false,\"assignee\":null,\"assignees\":[],\"milestone\":null,\"comments\":0,\"created_at\":\"2021-05-31T22:27:46Z\",\"updated_at\":\"2021-05-31T22:27:46Z\",\"closed_at\":null,\"author_association\":\"OWNER\",\"active_lock_reason\":null,\"body\":\"\",\"performed_via_github_app\":null},\"repository\":{\"id\":369022728,\"node_id\":\"MDEwOlJlcG9zaXRvcnkzNjkwMjI3Mjg=\",\"name\":\"merge-queue\",\"full_name\":\"DominikB2014/merge-queue\",\"private\":false,\"owner\":{\"login\":\"DominikB2014\",\"id\":44422760,\"node_id\":\"MDQ6VXNlcjQ0NDIyNzYw\",\"avatar_url\":\"https://avatars.githubusercontent.com/u/44422760?v=4\",\"gravatar_id\":\"\",\"url\":\"https://api.github.com/users/DominikB2014\",\"html_url\":\"https://github.com/DominikB2014\",\"followers_url\":\"https://api.github.com/users/DominikB2014/followers\",\"following_url\":\"https://api.github.com/users/DominikB2014/following{/other_user}\",\"gists_url\":\"https://api.github.com/users/DominikB2014/gists{/gist_id}\",\"starred_url\":\"https://api.github.com/users/DominikB2014/starred{/owner}{/repo}\",\"subscriptions_url\":\"https://api.github.com/users/DominikB2014/subscriptions\",\"organizations_url\":\"https://api.github.com/users/DominikB2014/orgs\",\"repos_url\":\"https://api.github.com/users/DominikB2014/repos\",\"events_url\":\"https://api.github.com/users/DominikB2014/events{/privacy}\",\"received_events_url\":\"https://api.github.com/users/DominikB2014/received_events\",\"type\":\"User\",\"site_admin\":false},\"html_url\":\"https://github.com/DominikB2014/merge-queue\",\"description\":null,\"fork\":false,\"url\":\"https://api.github.com/repos/DominikB2014/merge-queue\",\"forks_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/forks\",\"keys_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/keys{/key_id}\",\"collaborators_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/collaborators{/collaborator}\",\"teams_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/teams\",\"hooks_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/hooks\",\"issue_events_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/issues/events{/number}\",\"events_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/events\",\"assignees_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/assignees{/user}\",\"branches_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/branches{/branch}\",\"tags_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/tags\",\"blobs_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/git/blobs{/sha}\",\"git_tags_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/git/tags{/sha}\",\"git_refs_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/git/refs{/sha}\",\"trees_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/git/trees{/sha}\",\"statuses_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/statuses/{sha}\",\"languages_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/languages\",\"stargazers_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/stargazers\",\"contributors_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/contributors\",\"subscribers_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/subscribers\",\"subscription_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/subscription\",\"commits_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/commits{/sha}\",\"git_commits_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/git/commits{/sha}\",\"comments_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/comments{/number}\",\"issue_comment_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/issues/comments{/number}\",\"contents_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/contents/{+path}\",\"compare_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/compare/{base}...{head}\",\"merges_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/merges\",\"archive_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/{archive_format}{/ref}\",\"downloads_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/downloads\",\"issues_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/issues{/number}\",\"pulls_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/pulls{/number}\",\"milestones_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/milestones{/number}\",\"notifications_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/notifications{?since,all,participating}\",\"labels_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/labels{/name}\",\"releases_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/releases{/id}\",\"deployments_url\":\"https://api.github.com/repos/DominikB2014/merge-queue/deployments\",\"created_at\":\"2021-05-19T23:06:19Z\",\"updated_at\":\"2021-05-31T22:21:29Z\",\"pushed_at\":\"2021-05-31T22:21:27Z\",\"git_url\":\"git://github.com/DominikB2014/merge-queue.git\",\"ssh_url\":\"git@github.com:DominikB2014/merge-queue.git\",\"clone_url\":\"https://github.com/DominikB2014/merge-queue.git\",\"svn_url\":\"https://github.com/DominikB2014/merge-queue\",\"homepage\":null,\"size\":978,\"stargazers_count\":0,\"watchers_count\":0,\"language\":\"JavaScript\",\"has_issues\":true,\"has_projects\":true,\"has_downloads\":true,\"has_wiki\":true,\"has_pages\":false,\"forks_count\":0,\"mirror_url\":null,\"archived\":false,\"disabled\":false,\"open_issues_count\":5,\"license\":null,\"forks\":0,\"open_issues\":5,\"watchers\":0,\"default_branch\":\"master\"},\"sender\":{\"login\":\"DominikB2014\",\"id\":44422760,\"node_id\":\"MDQ6VXNlcjQ0NDIyNzYw\",\"avatar_url\":\"https://avatars.githubusercontent.com/u/44422760?v=4\",\"gravatar_id\":\"\",\"url\":\"https://api.github.com/users/DominikB2014\",\"html_url\":\"https://github.com/DominikB2014\",\"followers_url\":\"https://api.github.com/users/DominikB2014/followers\",\"following_url\":\"https://api.github.com/users/DominikB2014/following{/other_user}\",\"gists_url\":\"https://api.github.com/users/DominikB2014/gists{/gist_id}\",\"starred_url\":\"https://api.github.com/users/DominikB2014/starred{/owner}{/repo}\",\"subscriptions_url\":\"https://api.github.com/users/DominikB2014/subscriptions\",\"organizations_url\":\"https://api.github.com/users/DominikB2014/orgs\",\"repos_url\":\"https://api.github.com/users/DominikB2014/repos\",\"events_url\":\"https://api.github.com/users/DominikB2014/events{/privacy}\",\"received_events_url\":\"https://api.github.com/users/DominikB2014/received_events\",\"type\":\"User\",\"site_admin\":false},\"installation\":{\"id\":17048727,\"node_id\":\"MDIzOkludGVncmF0aW9uSW5zdGFsbGF0aW9uMTcwNDg3Mjc=\"}}"
// }

// handler(event as any | APIGatewayProxyEventV2, {} as any);
