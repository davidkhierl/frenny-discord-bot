import { BotEventClient } from '../../../core/BotWithCommands.js';
import saveBot from '../../../services/saveBot.js';
import chalk from 'chalk';
import { log } from 'console';

const ready: BotEventClient = {
	name: 'ready',
	once: true,
	execute: async (client) => {
		try {
			// add bot to database
			await saveBot(client.user);

			log(
				chalk.greenBright('[Ready]:'),
				chalk.blue(`${client.user.tag}`)
			);
		} catch (error) {
			if (error instanceof Error) console.log(error);
		}
	},
};

export default ready;