import exec from '../lib/exec';
import bundleSize from '../lib/bundle-size-pr-comment.js';

export let description = 'run branch commands';

export let globalDependencies = [
	'origami-build-tools',
	'@financial-times/origami-bundle-size-cli',
];

export async function command() {
	await exec('obt', 'install');
	await exec('obt', 'verify');
	await exec('obt', 'test');
	await bundleSize();
}
