import type { PieceContext } from '@sapphire/pieces';
import type { User } from 'revolt.js';

import { resolveUser } from '../lib/resolvers/user';
import { Argument, AsyncArgumentResult } from '../lib/structures/argument';
import type { ArgumentContext } from '../utils/interfaces/argument';

export class CoreArgument extends Argument<User> {
	public constructor(context: PieceContext) {
		super(context, { name: 'user' });
	}

	public async run(parameter: string, context: ArgumentContext): AsyncArgumentResult<User> {
		const resolved = await resolveUser(parameter);
		return resolved.mapErrInto((identifier) =>
			this.error({
				parameter,
				identifier,
				message: 'The argument did not resolve to a user.',
				context
			})
		);
	}
}
