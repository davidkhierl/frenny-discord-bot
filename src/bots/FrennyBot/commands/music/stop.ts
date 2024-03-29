import Bot from '../../../../core/bot/Bot.js';
import BotCommandBuilder from '../../../../core/bot/BotCommandBuilder.js';
import UserCommandError from '../../../../core/bot/UserCommandError.js';
import MessageEmbeds from '../../../../core/components/MessageEmbeds.js';
import { isMusic } from '../../../../core/modules/Music/isMusic.js';
import { ChatInputCommandInteraction } from 'discord.js';

class stop extends BotCommandBuilder {
	constructor() {
		super({ deferReply: true, ephemeral: true });
		this.slash.setName('stop').setDescription('Stop playing music');
	}

	async execute(
		interaction: ChatInputCommandInteraction,
		bot: Bot
	): Promise<void> {
		const music = bot.modules.get('music');

		if (!isMusic(music) || !interaction.guildId) return;

		const { queue } = music.init(interaction);

		queue.setData({ interaction });

		if (!queue.isPlaying)
			throw new UserCommandError(
				'🙄   Yow! there are no songs being played'
			);

		queue.stop();

		await queue.data?.interaction.followUp({
			embeds: [MessageEmbeds.Warning({ title: 'Stopping music' })],
		});
	}
}

// noinspection JSUnusedGlobalSymbols
export default stop;
