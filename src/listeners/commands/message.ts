import type { PieceContext } from '@sapphire/pieces';
import type { Message } from 'revolt.js/dist/maps/Messages';

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
		if (message.author?.bot) return;
		if (message.asSystemMessage.type) return;

		return this.container.client.emit(CommandEvents.CommandPreParse, message);
	}
}
