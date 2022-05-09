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
		const content = message.content!.toLowerCase();
		const prefix = await this.container.client.fetchPrefix(message);
		if (!prefix) return;

		const matchedPrefix = this.commandPrefix(prefix, content);
		if (matchedPrefix) {
			return this.container.client.emit(CommandEvents.CommandParse, { message, prefix: matchedPrefix });
		}

		return this.container.client.emit(CommandEvents.NonPrefixedCommand, { message });
	}

	private commandPrefix(prefix: string | readonly string[], content: string) {
		if (typeof prefix === 'string') {
			const matched = content.startsWith(prefix.toLowerCase());
			return matched ? prefix : null;
		}

		return prefix.find((p) => content.startsWith(p));
	}
}
