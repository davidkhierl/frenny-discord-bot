import Bot, { UserCommandError } from '../../../../core/bot/Bot.js';
import BotCommandBuilder from '../../../../core/bot/BotCommandBuilder.js';
import { isMusic } from '../../../../core/modules/Music.js';
import { ChatInputCommandInteraction } from 'discord.js';

export default class stop extends BotCommandBuilder {
	constructor() {
		super({ deferReply: false, ephemeral: false });
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
			throw new UserCommandError('🙄   Yow! there are no songs playing');

		queue.stop();
	}
}