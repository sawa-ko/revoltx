import type { PieceContext } from '@sapphire/pieces';
import { Message, Permission } from 'revolt.js';

import { Listener } from '../../lib/structures/listener';
import { CommandEvents } from '../../utils/enums/command';
import { ClientEvents } from '../../utils/enums/events';

export class CoreListener extends Listener {
	public constructor(context: PieceContext) {
		super(context, {
			event: ClientEvents.MessageCreate
		});
	}

	public run(message: Message) {
		if (message.author?.bot || !message.channel) return;

		const channelPermissions = message.channel.permissions ?? message.channel.default_permissions ?? 0;
		if (!(channelPermissions & Permission.SendMessage) && Permission.SendMessage) return;
		if (!(channelPermissions & Permission.ViewChannel) && Permission.ViewChannel) return;

		return this.container.client.emit(CommandEvents.CommandPreParse, message);
	}
}
