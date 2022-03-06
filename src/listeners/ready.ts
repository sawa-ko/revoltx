import type { PieceContext } from '@sapphire/pieces';

import { ClientEvents } from '../utils/enums/events';
import { Listener } from '../lib/structures/listener';

export class CoreListener extends Listener {
	public constructor(context: PieceContext) {
		super(context, {
			event: ClientEvents.Ready
		});
	}

	public run() {
		this.container.client.id = this.container.client.bot.user?._id;
	}
}
