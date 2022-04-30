import type { PieceContext } from '@sapphire/pieces';

import { Listener } from '../lib/structures/listener';
import { ListenerEvents } from '../utils/enums/listener';
import type { ListenerErrorPayload } from '../utils/interfaces/listener';

export class CoreEvent extends Listener {
	public constructor(context: PieceContext) {
		super(context, {
			event: ListenerEvents.ListenerError
		});
	}

	public run(payload: ListenerErrorPayload) {
		const { listener, error } = payload;
		this.container.logger.error(`Encountered error on listener "${listener.name}" at path "${listener.location.full}"`, error);
	}
}
