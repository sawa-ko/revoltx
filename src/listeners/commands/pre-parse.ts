import type { PieceContext } from '@sapphire/pieces';
import type { Message } from 'revolt.js';

import { Listener } from '../../lib/structures/listener';
import { CommandEvents } from '../../utils/enums/command';

export class CoreListener extends Listener {
	public constructor(context: PieceContext) {
		super(context, {
			event: CommandEvents.CommandPreParse
		});
	}

	public async run(message: Message) {
		const content = (message.content as string).toLowerCase();
		const prefix = await this.container.client.fetchPrefix(message);

		if (prefix) {
			if (typeof prefix === 'string') {
				if (content.startsWith(prefix.toLowerCase())) {
					return this.container.client.emit(CommandEvents.CommandParse, { message, prefix });
				}

				return this.container.client.emit(CommandEvents.NonPrefixedCommand, { message });
			}

			const matchedPrefix = prefix.find((prefix) => content.startsWith(prefix.toLowerCase()));
			if (matchedPrefix) return this.container.client.emit(CommandEvents.CommandParse, { message, prefix: matchedPrefix });
		}

		return this.container.client.emit(CommandEvents.NonPrefixedCommand, { message });
	}
}
