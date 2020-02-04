let NPM_TOKEN = process.env.NPM_TOKEN;
let NPM_AUTH_TOKEN = process.env.NPM_AUTH_TOKEN;
let npmToken;
if (NPM_TOKEN && !NPM_AUTH_TOKEN) {
	npmToken = NPM_TOKEN;
} else if (NPM_AUTH_TOKEN && !NPM_TOKEN) {
	npmToken = NPM_AUTH_TOKEN;
} else if (NPM_AUTH_TOKEN == NPM_TOKEN) {
	npmToken = NPM_AUTH_TOKEN;
} else {
	throw new Error(
		'Environment variables `NPM_TOKEN` and `NPM_AUTH_TOKEN` are currently set to different values. Please set either `NPM_TOKEN` or `NPM_AUTH_TOKEN`, not both.'
	);
}

export default {
	name: process.env.ORIGAMI_CI_NAME || process.env.CIRCLE_PROJECT_REPONAME,
	version:
		process.env.ORIGAMI_CI_VERSION || `${process.env.CIRCLE_TAG}`.slice(1),
	npmToken,
	githubToken: process.env.GITHUB_TOKEN,
	pullRequestUrl:
		process.env.ORIGAMI_PULL_REQUEST || process.env.CIRCLE_PULL_REQUEST,
	path: process.env.PATH,
	npmInstallPrefix: `${process.env.HOME}/npm`,
};
