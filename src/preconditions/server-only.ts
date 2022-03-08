import type { PieceContext } from '@sapphire/pieces';
import type { Message } from 'revolt.js/dist/maps/Messages';

import { Identifiers } from '../lib/errors/identifiers';
import { Precondition, PreconditionResult } from '../lib/structures/precondition';

export class CorePrecondition extends Precondition {
	public constructor(context: PieceContext) {
		super(context, { name: 'ServerOnly' });
	}

	public run(message: Message): PreconditionResult {
		return message.channel?.server_id
			? this.ok()
			: this.error({ identifier: Identifiers.PreconditionsNsfw, message: 'You cannot run this command outside a server.' });
	}
}
