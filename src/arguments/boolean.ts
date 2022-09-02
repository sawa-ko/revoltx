import type { PieceContext } from '@sapphire/pieces';

import { resolveBoolean } from '../lib/resolvers/boolean';
import { Argument, ArgumentResult } from '../lib/structures/argument';
import type { ArgumentContext } from '../utils/interfaces/argument';

export class CoreArgument extends Argument<boolean> {
	public constructor(context: PieceContext) {
		super(context, { name: 'boolean' });
	}

	public run(parameter: string, context: { readonly truths?: string[]; falses?: readonly string[] } & ArgumentContext): ArgumentResult<boolean> {
		const resolved = resolveBoolean(parameter, { truths: context.truths, falses: context.falses });
		return resolved.mapErrInto((identifier) =>
			this.error({
				parameter,
				identifier,
				message: 'The argument did not resolve to a boolean.',
				context
			})
		);
	}
}
