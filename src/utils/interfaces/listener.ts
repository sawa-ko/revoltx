import type { PieceJSON, PieceOptions } from '@sapphire/pieces';
import type EventEmitter from 'events';

import type { Client } from '../../lib/client';
import type { Listener } from '../../lib/structures/listener';

export interface ListenerOptions extends PieceOptions {
	readonly emitter?: keyof Client | EventEmitter;
	readonly event?: string | symbol;
	readonly once?: boolean;
}

export interface ListenerJSON extends PieceJSON {
	event: string | symbol;
	once: boolean;
}

export interface ListenerErrorPayload {
	listener: Listener;
	error: unknown;
}
