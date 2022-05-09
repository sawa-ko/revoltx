import type { PieceContext } from '@sapphire/pieces';

import { Listener } from '../../lib/structures/listener';
import { CommandEvents } from '../../utils/enums/command';
import type { CommandParsePayload } from '../../utils/interfaces/command';

export class CoreListener extends Listener {
	public constructor(context: PieceContext) {
		super(context, {
			event: CommandEvents.CommandParse
		});
	}

	public run(payload: CommandParsePayload) {
		const prefixLess = payload.message.content!.slice(payload.prefix.length).trim();
		const spaceIndex = prefixLess.indexOf(' ');
		const commandName = spaceIndex === -1 ? prefixLess : prefixLess.slice(0, spaceIndex);

		if (commandName.length === 0) {
			return this.container.client.emit(CommandEvents.CommandNameNotFound, { message: payload.message, commandName });
		}

		const command = this.container.stores.get('commands').get(commandName);
		if (!command) {
			return this.container.client.emit(CommandEvents.CommandNotFound, { message: payload.message, commandName });
		}

		const parameters = spaceIndex === -1 ? '' : prefixLess.slice(spaceIndex + 1).trim();
		return this.container.client.emit(CommandEvents.CommandPreAccepted, {
			message: payload.message,
			command,
			parameters,
			prefix: payload.prefix
		});
	}
}
