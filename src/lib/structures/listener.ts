import { Piece } from '@sapphire/pieces';
import { fromAsync, isErr } from '@sapphire/result';

import type { EventEmitter } from 'events';
import type { Client } from 'revolt.js';

import { CoreEvents } from '../../utils/enums/events';

export abstract class Listener extends Piece {
	/**
	 * The emitter, if any.
	 * @since 2.0.0
	 */
	public readonly emitter: EventEmitter | null;

	/**
	 * The name of the event the listener listens to.
	 * @since 2.0.0
	 */
	public readonly event: string | symbol;

	/**
	 * Whether or not the listener will be unloaded after the first run.
	 * @since 2.0.0
	 */
	public readonly once: boolean;

	private _listener: ((...args: any[]) => void) | null;

	public constructor(context: Listener.Context, options: Listener.Options = {} as Listener.Options) {
		super(context, options);

		this.emitter =
			typeof options.emitter === 'undefined'
				? this.container.client
				: (typeof options.emitter === 'string' ? (Reflect.get(this.container.client, options.emitter) as EventEmitter) : options.emitter) ??
				  null;
		this.event = options.event ?? this.name;
		this.once = options.once ?? false;

		this._listener = this.emitter && this.event ? (this.once ? this._runOnce.bind(this) : this._run.bind(this)) : null;

		// If there's no emitter or no listener, disable:
		if (this.emitter === null || this._listener === null) this.enabled = false;
	}

	public abstract run(...args: unknown[]): unknown;

	public onLoad() {
		if (this._listener) {
			const emitter = this.emitter!;

			// Increment the maximum amount of listeners by one:
			const maxListeners = emitter.getMaxListeners();
			if (maxListeners !== 0) emitter.setMaxListeners(maxListeners + 1);

			emitter[this.once ? 'once' : 'on'](this.event, this._listener);
		}
		return super.onLoad();
	}

	public onUnload() {
		if (!this.once && this._listener) {
			const emitter = this.emitter!;

			// Increment the maximum amount of listeners by one:
			const maxListeners = emitter.getMaxListeners();
			if (maxListeners !== 0) emitter.setMaxListeners(maxListeners - 1);

			emitter.off(this.event, this._listener);
			this._listener = null;
		}

		return super.onUnload();
	}

	public toJSON(): ListenerJSON {
		return {
			...super.toJSON(),
			once: this.once,
			event: this.event
		};
	}

	private async _run(...args: unknown[]) {
		const result = await fromAsync(() => this.run(...args));
		if (isErr(result)) {
			this.container.client.emit(CoreEvents.ListenerError, result.error, { piece: this });
		}
	}

	private async _runOnce(...args: unknown[]) {
		await this._run(...args);
		await this.unload();
	}
}

export interface ListenerOptions extends Piece.Options {
	readonly emitter?: keyof Client | EventEmitter;
	readonly event?: string | symbol;
	readonly once?: boolean;
}

export interface ListenerJSON extends Piece.JSON {
	event: string | symbol;
	once: boolean;
}

export namespace Listener {
	export type Options = ListenerOptions;
	export type JSON = ListenerJSON;
	export type Context = Piece.Context;
}
