import type { PieceContext } from '@sapphire/pieces';

import { resolveEnum } from '../lib/resolvers/enum';
import { Argument, ArgumentResult } from '../lib/structures/argument';
import type { ArgumentContext } from '../utils/interfaces/argument';

export class CoreArgument extends Argument<string> {
	public constructor(context: PieceContext) {
		super(context, { name: 'enum' });
	}

	public run(
		parameter: string,
		context: { readonly enum?: string[]; readonly caseInsensitive?: boolean } & ArgumentContext
	): ArgumentResult<string> {
		const resolved = resolveEnum(parameter, { enum: context.enum, caseInsensitive: context.caseInsensitive });
		if (resolved.success) return this.ok(resolved.value);
		return this.error({
			parameter,
			identifier: resolved.error,
			message: `The argument must have one of the following values: ${context.enum?.join(', ')}`,
			context
		});
	}
}
