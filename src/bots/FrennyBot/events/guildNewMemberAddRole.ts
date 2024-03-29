import { BotEvent } from '../../../core/bot/Bot.js';
import { BotEventError } from '../../../core/bot/BotEventError.js';
import getGuildDefaultRoleId from '../../../services/getGuildDefaultRoleId.js';
import * as Sentry from '@sentry/node';
import { GuildMember } from 'discord.js';

/**
 * Apply role to new members
 */
const guildNewMemberAddRole: BotEvent<GuildMember> = {
	name: 'guildMemberAdd',
	execute: async (guildMember) => {
		// ? Still not sure if sentry transaction is necessary here.

		if (!guildMember.guild.available)
			throw new BotEventError('Guild not available');

		try {
			if (guildMember.user.bot) return;

			const newMembersRole = await getGuildDefaultRoleId(
				guildMember.guild.id
			);

			if (!newMembersRole) return;

			await guildMember.roles.add(newMembersRole);
		} catch (error) {
			console.log(error);

			Sentry.captureException(error);
		}
	},
};

// noinspection JSUnusedGlobalSymbols
export default guildNewMemberAddRole;
