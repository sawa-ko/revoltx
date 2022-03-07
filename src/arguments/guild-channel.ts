import type { PieceContext } from '@sapphire/pieces';
import type { Channel } from 'revolt.js/dist/maps/Channels';

import { resolveGuildChannel } from '../lib/resolvers/guild-channel';
import { Argument, ArgumentResult } from '../lib/structures/argument';
import type { ArgumentContext } from '../utils/interfaces/argument';

export class CoreArgument extends Argument<Channel> {
	public constructor(context: PieceContext) {
		super(context, { name: 'guildChannel' });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<Channel> {
		const resolved = resolveGuildChannel(parameter, context.message);
		if (resolved.success) return this.ok(resolved.value);
		return this.error({
			parameter,
			identifier: resolved.error,
			message: 'The argument did not resolve to a guild channel.',
			context
		});
	}
}
