import type { PieceContext } from '@sapphire/pieces';
import { Identifiers } from '../lib/errors/identifiers';
import { resolveFloat } from '../lib/resolvers/float';
import { Argument, ArgumentResult } from '../lib/structures/argument';
import type { ArgumentContext } from '../utils/interfaces/argument';

export class CoreArgument extends Argument<number> {
	private readonly messages = {
		[Identifiers.ArgumentFloatTooSmall]: ({ minimum }: ArgumentContext) => `The given number must be greater than ${minimum}.`,
		[Identifiers.ArgumentFloatTooLarge]: ({ maximum }: ArgumentContext) => `The given number must be less than ${maximum}.`,
		[Identifiers.ArgumentFloatError]: () => 'The argument did not resolve to a valid decimal.'
	} as const;

	public constructor(context: PieceContext) {
		super(context, { name: 'float' });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<number> {
		const resolved = resolveFloat(parameter, { minimum: context.minimum, maximum: context.maximum });
		return resolved.mapErrInto((identifier) =>
			this.error({
				parameter,
				identifier,
				message: this.messages[identifier](context),
				context
			})
		);
	}
}
