const { spawn } = require('child_process');
const scripts = ['dev:watch', 'dev:serve'];
const children = [];
let shuttingDown = false;

function getSpawnCommand(script) {
	const nodeExec = process.env.npm_node_execpath || process.execPath;
	const npmCli = process.env.npm_execpath;

	if (npmCli) {
		return {
			command: nodeExec,
			args: [npmCli, 'run', script],
		};
	}

	const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
	return {
		command: npmCommand,
		args: ['run', script],
	};
}

function start(script) {
	const { command, args } = getSpawnCommand(script);
	const child = spawn(command, args, {
		stdio: 'inherit',
		env: process.env,
		shell: false,
	});

	children.push(child);

	child.on('exit', (code, signal) => {
		if (!shuttingDown) {
			const exitCode = typeof code === 'number' ? code : signal ? 1 : 0;
			shutdown(exitCode);
		}
	});

	child.on('error', (error) => {
		console.error(`[dev] Failed to run ${script}:`, error);
		if (!shuttingDown) {
			shutdown(1);
		}
	});
}

function shutdown(code = 0) {
	if (!shuttingDown) {
		shuttingDown = true;
		for (const child of children) {
			if (!child.killed) {
				child.kill();
			}
		}
	}

	// Allow child processes a brief moment to exit gracefully.
	setTimeout(() => {
		process.exit(code);
	}, 100);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

scripts.forEach(start);
