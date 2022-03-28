import type { PieceContext } from '@sapphire/pieces';
import type { Message } from 'revolt.js';

import { resolveMessage } from '../lib/resolvers/message';
import { Argument, ArgumentResult } from '../lib/structures/argument';
import type { ArgumentContext } from '../utils/interfaces/argument';

export class CoreArgument extends Argument<Message> {
	public constructor(context: PieceContext) {
		super(context, { name: 'message' });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<Message> {
		const resolved = resolveMessage(parameter);
		if (resolved.success) return this.ok(resolved.value);
		return this.error({
			parameter,
			identifier: resolved.error,
			message: 'The argument did not resolve to a valid message.',
			context
		});
	}
}
