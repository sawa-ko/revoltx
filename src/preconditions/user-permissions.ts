import type { Message } from 'revolt.js/dist/maps/Messages';

import { Precondition } from '../lib/structures/precondition';
import { PermissionsManager } from '../lib/structures/permissions';
import { Identifiers } from '../lib/errors/identifiers';
import type { Command } from '../lib/structures/command';
import type { PieceContext } from '@sapphire/pieces';
import type { PermissionsContext } from '../utils/interfaces/precondition';

export class CorePrecondition extends Precondition {
	public constructor(context: PieceContext) {
		super(context, { name: 'UserPermissions' });
	}

	public async run(message: Message, _: Command, context: PermissionsContext) {
		const permissions = new PermissionsManager();
		if (context.channel_permissions.length > 0 && message.channel) {
			await permissions.computeChannelPermissions(message.channel, message.author);
		}

		if (context.channel_permissions.length > 0 && message.channel) {
			await permissions.computeChannelPermissions(message.channel, message.author);
		}

		const channelMissingPermissions = context.channel_permissions.filter((p) => !permissions.has(p, 'CHANNEL'));
		const ServerMissingPermissions = context.server_permissions.filter((p) => !permissions.has(p, 'CHANNEL'));
		const errorMessage = ['You are missing the following permissions to run this command:'];
		if (channelMissingPermissions.length > 0) errorMessage.push(`Channel: ${channelMissingPermissions.join(', ')}`);
		if (ServerMissingPermissions.length > 0) errorMessage.push(`Server: ${ServerMissingPermissions.join(', ')}`);

		return channelMissingPermissions.length === 0 && ServerMissingPermissions.length === 0
			? this.ok()
			: this.error({
					context: { missing: { channel: channelMissingPermissions, server: ServerMissingPermissions } },
					identifier: Identifiers.PreconditionClientPermissions,
					message: errorMessage.join('\n')
			  });
	}
}
