import exec from "~/lib/exec"
import env from "~/lib/env"

export let description = 'run branch commands';

export async function command() {
	await exec('obt', 'install');
	await exec('obt', 'demo', '--demo-filter', 'pa11y', '--suppress-errors');
	await exec('obt', 'verify');
	await exec('obt', 'test');
	await exec('git', 'clean', '-fxd');
	await exec('occ', '--name', env.name, '0.0.0');
	await exec('obt', 'install', '--ignore-bower');
	await exec('obt', 'test', '--ignore-bower');
}
