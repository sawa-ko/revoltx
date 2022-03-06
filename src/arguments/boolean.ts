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
		if (resolved.success) return this.ok(resolved.value);

		return this.error({
			parameter,
			identifier: resolved.error,
			message: 'The argument did not resolve to a boolean.',
			context
		});
	}
}
