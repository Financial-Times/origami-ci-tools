import execa from 'execa';
import env from './env';

export function getExecEnv() {
	return {
		PATH: `${env.npmInstallPrefix}/bin:${env.path}`
	}
}

export default async function exec(program, ...args) {
	return execa(program, args, {
		preferLocal: true,
		buffer: false,
		stdout: 'inherit',
		stderr: 'inherit',
		env: getExecEnv()
	});
}
