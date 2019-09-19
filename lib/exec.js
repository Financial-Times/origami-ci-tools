import execa from 'execa';

export default async function exec(program, ...args) {
	return execa(program, args, {
		preferLocal: true,
		buffer: false,
		stdout: 'inherit',
		stderr: 'inherit',
	});
}
