import { Piece, PieceContext } from '@sapphire/pieces';
import { Result } from '@sapphire/result';

import type { EventEmitter } from 'events';

import { ListenerEvents } from '../../utils/enums/listener';
import type { ListenerJSON, ListenerOptions } from '../../utils/interfaces/listener';

export abstract class Listener extends Piece {
	/**
	 * The emitter, if any.
	 * @since 1.0.0
	 */
	public readonly emitter: EventEmitter | null;

	/**
	 * The name of the event the listener listens to.
	 * @since 1.0.0
	 */
	public readonly event: string | symbol;

	/**
	 * Whether or not the listener will be unloaded after the first run.
	 * @since 1.0.0
	 */
	public readonly once: boolean;

	private _listener: ((...args: any[]) => void) | null;

	public constructor(context: PieceContext, options: ListenerOptions = {}) {
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

	public override onLoad() {
		if (this._listener) {
			const emitter = this.emitter!;

			// Increment the maximum amount of listeners by one:
			const maxListeners = emitter.getMaxListeners();
			if (maxListeners !== 0) emitter.setMaxListeners(maxListeners + 1);

			emitter[this.once ? 'once' : 'on'](this.event, this._listener);
		}
		return super.onLoad();
	}

	public override onUnload() {
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

	public override toJSON(): ListenerJSON {
		return {
			...super.toJSON(),
			once: this.once,
			event: this.event
		};
	}

	private async _run(...args: unknown[]) {
		const result = await Result.fromAsync(() => this.run(...args));
		if (result.isErr()) {
			this.container.client.emit(ListenerEvents.ListenerError, { listener: this, error: result.err().unwrap() });
		}
	}

	private async _runOnce(...args: unknown[]) {
		await this._run(...args);
		await this.unload();
	}
}
