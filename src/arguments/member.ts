import type { PieceContext } from '@sapphire/pieces';
import type { Member } from 'revolt.js';

import { resolveMember } from '../lib/resolvers/member';
import { Argument, AsyncArgumentResult } from '../lib/structures/argument';
import type { ArgumentContext } from '../utils/interfaces/argument';

export class CoreArgument extends Argument<Member> {
	public constructor(context: PieceContext) {
		super(context, { name: 'member' });
	}

	public async run(parameter: string, context: ArgumentContext): AsyncArgumentResult<Member> {
		const resolved = await resolveMember(parameter, context.message);
		return resolved.mapErrInto((identifier) =>
			this.error({
				parameter,
				identifier,
				message: 'The argument did not resolve to a member.',
				context
			})
		);
	}
}
