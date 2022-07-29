import { BotEvent } from '../../../core/BotWithCommands.js';
import SentryHelper from '../../../helpers/SentryHelper.js';
import deleteRole from '../../../services/deleteRole.js';
import * as Sentry from '@sentry/node';
import { Role } from 'discord.js';

/**
 * Delete guild role on role delete
 */
const onRoleDelete: BotEvent<Role> = {
	name: 'roleDelete',
	execute: async (role) => {
		const transaction = SentryHelper.startGuildEventTransaction({
			op: 'roleDelete',
		});

		Sentry.setTag('guild_event', 'roleDelete');

		Sentry.configureScope((scope) => {
			scope.setSpan(transaction);
		});

		Sentry.setContext('role', {
			id: role.id,
			name: role.name,
			managed: role.managed,
		});

		Sentry.setContext('guild', {
			id: role.guild.id,
			name: role.guild.name,
		});

		try {
			// ignore managed role
			if (role.managed) {
				transaction.finish();
				return;
			}

			// delete role on database
			await deleteRole(role.id);
		} catch (error) {
			if (error instanceof Error) console.log(error.message);

			Sentry.captureException(error);
		}

		transaction.finish();
	},
};

export default onRoleDelete;
