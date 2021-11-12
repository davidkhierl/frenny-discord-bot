import { GatewayServer } from 'slash-create';
import client from './client';
import creator from './creator';
import dotenv from 'dotenv';
import path from 'path';
import player from './player';
import { registerPlayerEvents } from './events';

dotenv.config();

registerPlayerEvents(player);

client.on('ready', () => {
	if (!client.user) {
		console.log('User not found');
		return;
	}
	client.user.setActivity({ name: 'with Frennies', type: 'PLAYING' });
	console.log(`Logged in as ${client.user.tag}!`);
});

creator
	.withServer(
		new GatewayServer((handler) =>
			client.ws.on('INTERACTION_CREATE', handler)
		)
	)
	.registerCommandsIn(path.join(__dirname, 'commands'))
	.syncCommands({ deleteCommands: true });

client.login(process.env.DISCORD_CLIENT_TOKEN);
