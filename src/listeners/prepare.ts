import type { PieceContext } from '@sapphire/pieces';
import type { ClientboundNotification } from 'revolt.js/dist/websocket/notifications';

import { ClientEvents } from '../utils/enums/events';
import { Listener } from '../lib/structures/listener';

export class CoreListener extends Listener {
	public constructor(context: PieceContext) {
		super(context, {
			event: ClientEvents.PACKED
		});
	}

	public run(packet: ClientboundNotification) {
		if (packet.type === 'Pong') {
			this.container.client.ping = packet.data;
		}
	}
}
