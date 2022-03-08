import { Piece } from '@sapphire/pieces';
import type { Awaitable } from '@sapphire/utilities';
import type { Message } from 'revolt.js/dist/maps/Messages';

import { PreconditionError } from '../errors/precondition-error';
import { err, ok, Result } from '../parsers/result';
import type { UserError } from '../errors/user-error';
import type { Command } from './command';
import type { PreconditionOptions, PreconditionContext } from '../../utils/interfaces/precondition';

export type PreconditionResult = Awaitable<Result<unknown, UserError>>;
export type AsyncPreconditionResult = Promise<Result<unknown, UserError>>;

export abstract class Precondition<O extends PreconditionOptions = PreconditionOptions> extends Piece<O> {
	public readonly position: number | null;

	public constructor(context: Piece.Context, options: PreconditionOptions = {}) {
		super(context, options);
		this.position = options.position ?? null;
	}

	public abstract run(message: Message, command: Command, context: PreconditionContext): PreconditionResult;

	public ok(): PreconditionResult {
		return ok();
	}

	/**
	 * Constructs a {@link PreconditionError} with the precondition parameter set to `this`.
	 * @param options The information.
	 */
	public error(options: Omit<PreconditionError.Options, 'precondition'> = {}): PreconditionResult {
		return err(new PreconditionError({ precondition: this, ...options }));
	}
}
