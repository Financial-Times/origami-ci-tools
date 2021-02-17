import exec from '../lib/exec';

export let description = 'run branch commands';

export let globalDependencies = [
	'origami-build-tools'
];

export async function command() {
	await exec('obt', 'install');
	await exec('obt', 'verify');
	await exec('obt', 'test');
}
