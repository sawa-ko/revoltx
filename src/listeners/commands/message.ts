import { calculatePermission, Message, Permission } from 'revolt.js';
import type { PieceContext } from '@sapphire/pieces';

import { Listener } from '../../lib/structures/listener';
import { PermissionsManager } from '../../lib/utils/permissions';
import { CommandEvents } from '../../utils/enums/command';
import { ClientEvents } from '../../utils/enums/events';

export class CoreListener extends Listener {
	public constructor(context: PieceContext) {
		super(context, {
			event: ClientEvents.MessageCreate
		});
	}

	public async run(message: Message) {
		if (message.author?.bot || !message.channel || !message.content) return;

		const permission = new PermissionsManager().add(
			calculatePermission(message.channel, {
				member: await message.channel.server?.fetchMember(message.client.user ?? '')
			})
		);

		if (!permission.has(Permission.SendMessage) || !permission.has(Permission.ViewChannel)) return;
		return this.container.client.emit(CommandEvents.CommandPreParse, message);
	}
}
