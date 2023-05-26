import chalk from "chalk";

export default class Logger {
	static info(message: string) {
		console.log(`[ ${chalk.cyan("INFO")} ] ${message}`);
	}

	static warn(message: string) {
		console.log(`[ ${chalk.yellow("WARN")} ] ${message}`);
	}

	static error(message: string) {
		console.log(`[ ${chalk.red("ERROR")} ] ${message}`);
	}
}
