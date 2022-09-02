import type { PieceContext } from '@sapphire/pieces';
import type { Channel } from 'revolt.js';

import { resolveGuildChannel } from '../lib/resolvers/guild-channel';
import { Argument, ArgumentResult } from '../lib/structures/argument';
import type { ArgumentContext } from '../utils/interfaces/argument';

export class CoreArgument extends Argument<Channel> {
	public constructor(context: PieceContext) {
		super(context, { name: 'guildChannel' });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<Channel> {
		const resolved = resolveGuildChannel(parameter, context.message);
		return resolved.mapErrInto((identifier) =>
			this.error({
				parameter,
				identifier,
				message: 'The argument did not resolve to a guild channel.',
				context
			})
		);
	}
}
