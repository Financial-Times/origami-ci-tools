import exec from './exec';
import env from './env';
import {resolve as resolvePath} from 'path';
import {promises as fs} from 'fs';

export default async function installDependencies(names) {
	if (!Array.isArray(names)) {
		throw new Error('expected dependencies to be an array');
	}
	let manifest;

	try {
		let packageJson = await fs.readFile(
			resolvePath(__dirname, '..', 'package.json'),
			'utf-8'
		);
		manifest = JSON.parse(packageJson);
	} catch {
		throw new Error(
			"couldn't parse origami-ci package.json as JSON, ensure it's there and valid json!"
		);
	}

	let specs = names.map(name => {
		let version = manifest.peerDependencies[name];
		if (!version) {
			throw new Error(
				`expected dependency "${name}" to be listed in origami-ci's peerDependencies`
			);
		}
		return `${name}@${version}`;
	});
	for (let spec of specs) {
		await exec('npm', 'install', '-g', spec, '--prefix', env.npmInstallPrefix);
	}
}