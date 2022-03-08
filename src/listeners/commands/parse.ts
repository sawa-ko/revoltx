import type { PieceContext } from '@sapphire/pieces';
import type { Message } from 'revolt.js/dist/maps/Messages';

import { Listener } from '../../lib/structures/listener';
import { CommandEvents } from '../../utils/enums/command';

export class CoreListener extends Listener {
	public constructor(context: PieceContext) {
		super(context, {
			event: CommandEvents.CommandParse
		});
	}

	public run(message: Message) {
		const prefixLess = (message.content as string).slice(this.container.client.prefix.length).trim();
		const spaceIndex = prefixLess.indexOf(' ');
		const commandName = spaceIndex === -1 ? prefixLess : prefixLess.slice(0, spaceIndex);

		if (commandName.length === 0) {
			return this.container.client.emit(CommandEvents.CommandNameNotFound, { message, commandName });
		}

		const command = this.container.stores.get('commands').get(commandName);
		if (!command) {
			return this.container.client.emit(CommandEvents.CommandNotFound, { message, commandName });
		}

		const parameters = spaceIndex === -1 ? '' : prefixLess.slice(spaceIndex + 1).trim();
		return this.container.client.emit(CommandEvents.CommandPreAccepted, { message, command, parameters });
	}
}
