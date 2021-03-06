import {promises as fs} from 'fs';
import {homedir} from 'os';
import {resolve as resolvePath} from 'path';
import {gt, prerelease, coerce} from 'semver';

import exec from '../lib/exec';
import {execStdout} from '../lib/exec';
import env from '../lib/env';

export let description = 'run release commands';

export let globalDependencies = ['occ'];

export async function command() {
	let npmrcPath = resolvePath(homedir(), '.npmrc');
	if (env.npmToken == undefined) {
		throw new Error(
			'To use the release command you need to set the environment variable "NPM_TOKEN" with a valid npm token. \
			You can contact Origami for help with this via origami.support@ft.com or the Slack channel #origami-support.'
		);
	}
	await fs.writeFile(
		npmrcPath,
		`//registry.npmjs.org/:_authToken=${env.npmToken}`
	);

	/*
		Publishing to npm without `--tag` being set will make that version have the dist-tag `latest`.
		When someone does an install of the package without declaring a version or dist-tag then the
		`latest` dist-tag is used. This is a problem if an Origami component has a fixed/feature backported
		to an old version and that old version is published, because it will then be tagged as the `latest`
		version, which means users would not get the version they expect when they run `npm install o-component`.

		The code below attempts to solve the above issue by checking that the version being published is not
		 a prerelease and is the largest version compared to all previously published version. If the version
		 being published is either a prerelease or not the largest version then we tag the release with the
		 version to ensure that it does not get tagged with `latest`.
	*/
	const newVersion = coerce(env.version);
	const newVersionPrereleaseComponents = prerelease(env.version);
	const newVersionIsNotPrerelease = newVersionPrereleaseComponents === null;

	await exec('occ', '--name', env.name, '0.0.0');

	let versions = [];
	try {
		const versionsJson = await execStdout(
			'npm',
			'info',
			'.',
			'versions',
			'--json'
		);

		versions = JSON.parse(versionsJson);
	} catch (error) {
		// do not error if the component does not yet exist in npm
		if (!(typeof error.stderr === 'string' && error.stderr.includes('E404'))) {
			throw error;
		}
	}

	const stableVersions = versions.filter(version => {
		return prerelease(version) === null;
	});

	const newVersionIsLargestVersion = stableVersions.every(version => {
		return gt(newVersion, version);
	});

	await exec('npm', 'version', env.version, '--no-git-tag-version', '--force');

	if (newVersionIsNotPrerelease && newVersionIsLargestVersion) {
		await exec('npm', 'publish', '--access', 'public');
	} else {
		await exec(
			'npm',
			'publish',
			'--access',
			'public',
			'--tag',
			`tag--${env.version}`
		);
	}
}
