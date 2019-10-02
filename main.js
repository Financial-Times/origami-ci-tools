process.on('unhandledRejection', error => {
	console.error(error);
	process.exit(1);
});

import parseArgv from 'minimist';
import * as commands from './commands';
import installDependencies from './lib/install-dependencies';

let commandNames = Object.keys(commands);

function printHelp() {
	console.log(`Usage: ${process.argv[1]} <command>\n\n`);
	console.log('Commands: ');
	let maxCommandLength = commandNames.reduce(
		(max, name) => Math.max(max, name.length),
		0
	);

	for (let command in commands) {
		let lengthDifference = maxCommandLength - command.length;
		process.stdout.write(command);
		process.stdout.write(' '.repeat(lengthDifference) + ' \t');
		process.stdout.write(commands[command].description);
		process.stdout.write('\n');
	}
}

let args = parseArgv(process.argv.slice(2));

let [command] = args._;

if (!commandNames.includes(command)) {
	printHelp();
	process.exit(1);
}

if (args.h) {
	printHelp();
	process.exit(0);
}

(async function() {
	let commandConfig = commands[command];
	await installDependencies(commandConfig.globalDependencies);
	await commandConfig.command();
})();
