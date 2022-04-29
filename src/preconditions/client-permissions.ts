import { type Message, calculatePermission } from 'revolt.js';
import type { PieceContext } from '@sapphire/pieces';

import { Precondition } from '../lib/structures/precondition';
import { PermissionsManager } from '../lib/utils/permissions';
import { Identifiers } from '../lib/errors/identifiers';
import type { Command } from '../lib/structures/command';
import type { PermissionsContext } from '../utils/interfaces/precondition';

export class CorePrecondition extends Precondition {
	public constructor(context: PieceContext) {
		super(context, { name: 'ClientPermissions' });
	}

	public async run(message: Message, _: Command, context: PermissionsContext) {
		const permissions = new PermissionsManager();
		if (context.channel_permissions.length > 0 && message.channel) {
			const clientMember = await message.channel.server?.fetchMember(message.client.user ?? '');
			permissions.add(calculatePermission(message.channel, { member: clientMember }));
		}

		const channelMissingPermissions = context.channel_permissions.filter((p) => !permissions.has(p));
		const ServerMissingPermissions = context.server_permissions.filter((p) => !permissions.has(p));
		const errorMessage = ['I am missing the following permissions to run this command:'];
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
