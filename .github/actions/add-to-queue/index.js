const core = require('@actions/core');
const github = require('@actions/github');

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

    await octokit.rest.checks.create({
      owner: gitHubRepoOwner,
      repo: gitHubRepoName,
      name: 'Check Created by API',
      head_sha: '150a7656ef1f544c0fcbf2bb016cdb812be9c727',
      status: 'completed',
      conclusion: 'success',
      output: {
        title: 'Check Created by API',
        summary: `# All good ![step 1](https://commons.wikimedia.org/wiki/File:Flat_tick_icon.svg "Step 1")`,
      },
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
