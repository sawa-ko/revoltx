import type { PieceContext } from '@sapphire/pieces';
import type { Member } from 'revolt-api/types/Servers';

import { resolveMember } from '../lib/resolvers/role';
import { Argument, AsyncArgumentResult } from '../lib/structures/argument';
import type { ArgumentContext } from '../utils/interfaces/argument';

export class CoreArgument extends Argument<Member> {
	public constructor(context: PieceContext) {
		super(context, { name: 'member' });
	}

	public async run(parameter: string, context: ArgumentContext): AsyncArgumentResult<Member> {
		const resolved = await resolveMember(parameter, context.message);
		if (resolved.success) return this.ok(resolved.value);
		return this.error({
			parameter,
			identifier: resolved.error,
			message: 'The given argument did not resolved with a server member.',
			context
		});
	}
}
