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
		return resolved.mapErrInto((identifier) =>
			this.error({
				parameter,
				identifier,
				message: 'The argument did not resolve to a enum.',
				context
			})
		);
	}
}
