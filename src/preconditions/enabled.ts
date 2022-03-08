import type { PieceContext } from '@sapphire/pieces';
import type { Message } from 'revolt.js/dist/maps/Messages';

import { Identifiers } from '../lib/errors/identifiers';
import { Precondition, PreconditionResult } from '../lib/structures/precondition';
import type { Command } from '../lib/structures/command';
import type { PreconditionContext } from '../utils/interfaces/precondition';

export class CorePrecondition extends Precondition {
	public constructor(context: PieceContext) {
		super(context, { position: 10 });
	}

	public run(_: Message, command: Command, context: PreconditionContext): PreconditionResult {
		return command.enabled ? this.ok() : this.error({ identifier: Identifiers.CommandDisabled, message: 'This command is disabled.', context });
	}
}
