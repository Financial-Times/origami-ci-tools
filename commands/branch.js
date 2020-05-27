import exec from '../lib/exec';
import env from '../lib/env';
import bundleSize from '../lib/bundle-size-pr-comment.js';
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

let getNpmPackageName = async () => {
	if (existsSync('./package.json')) {
		const packageInfo = JSON.parse(
			await fs.readFile('./package.json', 'utf-8')
		);
		if (packageInfo.name) {
			return packageInfo.name;
		}
	}
	return env.name;
};

export async function command() {
	let temporaryVersion = `0.0.0`;
	let packageName = await getNpmPackageName();
	let tarballFileName = `financial-times-${packageName}-${temporaryVersion}.tgz`;
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
