import {promises as fs} from 'fs';
import {homedir} from 'os';
import {resolve as resolvePath} from 'path';

import exec from '../lib/exec';
import env from '../lib/env';

export let description = 'run release commands';

export async function command() {
	await exec('occ', '--name', env.name, env.version);
	let npmrcPath = resolvePath(homedir(), '.npmrc');
	await fs.writeFile(
		npmrcPath,
		`//registry.npmjs.org/:_authToken=${env.npmToken}`
	);
	await exec('npm', 'publish', '--access', 'public');
}
