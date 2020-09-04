import execa from 'execa';
import env from './env.js';

export function getExecEnv() {
	return {
		PATH: `${env.npmInstallPrefix}/bin:${env.path}`,
	};
}

export default async function exec(program, ...args) {
	return execa(program, args, {
		preferLocal: true,
		buffer: false,
		stdout: 'inherit',
		stderr: 'inherit',
		env: getExecEnv(),
	});
}

export async function execStdout(program, ...args) {
	const res = await execa(program, args, {
		preferLocal: true,
		env: getExecEnv(),
	});

	return res.stdout;
}
