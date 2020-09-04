import exec from '../lib/exec.js';
import env from '../lib/env.js';
import bundleSize from '../lib/bundle-size-pr-comment.js.js';
import {promises as fs, existsSync} from 'fs';
import tar from 'tar';
import {promisify} from 'util';
import ncp from 'ncp';

// copy 16 files at once
ncp.limit = 16;

let copyRecursively = promisify(ncp);

export let description = 'run branch commands';

export let globalDependencies = [
	'origami-build-tools',
	'occ',
	'@financial-times/origami-bundle-size-cli',
];

let getShortId = () => Math.random().toString(36).slice(2);

export async function command() {
	let temporaryVersion = `0.0.0`;
	let tarballFileName = `financial-times-${env.name}-${temporaryVersion}.tgz`;
	// ftdomdelegate is special. It is not published under any org.
	if (env.name === 'ftdomdelegate') {
		tarballFileName = `${env.name}-${temporaryVersion}.tgz`;
	}
	let buildDir = 'occ-build-' + getShortId();
	await exec('obt', 'install');
	await exec('obt', 'demo', '--demo-filter', 'pa11y', '--suppress-errors');
	await exec('obt', 'verify');
	await exec('obt', 'test');
	await exec('git', 'clean', '-fxd');
	await exec('occ', '--name', env.name, temporaryVersion);
	await exec('npm', 'pack');
	await fs.mkdir(buildDir);
	await tar.extract({
		file: tarballFileName,
		strip: 1,
		cwd: buildDir,
	});
	process.chdir(buildDir);
	await exec('obt', 'install', '--ignore-bower');
	if (existsSync('../test')) {
		await copyRecursively('../test', '.');
	}
	// this is required for now because obt uses bower.json#name in karma tests
	// TODO remove when this requirement no longer exists
	await fs.writeFile('bower.json', `{"name": "${env.name}"}`);
	await exec('obt', 'test', '--ignore-bower');
	process.chdir('..');
	await bundleSize();
}
