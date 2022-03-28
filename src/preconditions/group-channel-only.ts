import type { PieceContext } from '@sapphire/pieces';
import type { Message } from 'revolt.js';

import { Identifiers } from '../lib/errors/identifiers';
import { Precondition, PreconditionResult } from '../lib/structures/precondition';

export class CorePrecondition extends Precondition {
	public constructor(context: PieceContext) {
		super(context, { name: 'GroupChannelOnly' });
	}

	public run(message: Message): PreconditionResult {
		return message.channel?.channel_type === 'Group'
			? this.ok()
			: this.error({ identifier: Identifiers.PreconditionGroupChannel, message: 'You cannot run this command outside group channels.' });
	}
}
