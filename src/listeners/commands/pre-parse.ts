import type { PieceContext } from '@sapphire/pieces';
import type { Message } from 'revolt.js/dist/maps/Messages';

import { Listener } from '../../lib/structures/listener';
import { CommandEvents } from '../../utils/enums/command';

export class CoreListener extends Listener {
	public constructor(context: PieceContext) {
		super(context, {
			event: CommandEvents.CommandPreParse
		});
	}

	public run(message: Message) {
		const prefix = this.container.client.prefix.toLowerCase();
		const content = (message.content as string).toLowerCase();

		if (!content.startsWith(prefix)) return this.container.client.emit(CommandEvents.NonPrefixedCommand, { message, prefix });
		return this.container.client.emit(CommandEvents.CommandParse, message);
	}
}
