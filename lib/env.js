export default {
	name: process.env.ORIGAMI_CI_NAME || process.env.CIRCLE_PROJECT_REPONAME,
	version:
		process.env.ORIGAMI_CI_VERSION || `${process.env.CIRCLE_TAG}`.slice(1),
	npmToken: process.env.NPM_TOKEN,
	githubToken: process.env.GITHUB_TOKEN,
	pullRequestUrl:
		process.env.ORIGAMI_PULL_REQUEST || process.env.CIRCLE_PULL_REQUEST,
	path: process.env.PATH,
	npmInstallPrefix: `${process.env.HOME}/npm`,
};
