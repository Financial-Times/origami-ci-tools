import {promises as fs} from 'fs';
import {homedir} from 'os';
import {resolve as resolvePath} from 'path';

import exec from '../lib/exec';
import env from '../lib/env';

export let description = 'run release commands';

export let globalDependencies = ['occ'];

export async function command() {
	await exec('occ', '--name', env.name, env.version);
	let npmrcPath = resolvePath(homedir(), '.npmrc');
	if (env.npmToken == undefined) {
		throw new Error(
			'To use the release command you need to set the environment variable "NPM_TOKEN" with a valid npm token. \
			You can contact Origami for help with this via origami.support@ft.com or the Slack channel #ft-origami.'
		);
	}
	await fs.writeFile(
		npmrcPath,
		`//registry.npmjs.org/:_authToken=${env.npmToken}`
	);
	await exec('npm', 'publish', '--access', 'public');
}
