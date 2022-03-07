import type { PieceContext } from '@sapphire/pieces';
import type { URL } from 'url';

import { resolveHyperlink } from '../lib/resolvers/hyperlink';
import { Argument, ArgumentResult } from '../lib/structures/argument';
import type { ArgumentContext } from '../utils/interfaces/argument';

export class CoreArgument extends Argument<URL> {
	public constructor(context: PieceContext) {
		super(context, { name: 'hyperlink', aliases: ['url'] });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<URL> {
		const resolved = resolveHyperlink(parameter);
		if (resolved.success) return this.ok(resolved.value);
		return this.error({
			parameter,
			identifier: resolved.error,
			message: 'The argument did not resolve to a valid URL.',
			context
		});
	}
}
